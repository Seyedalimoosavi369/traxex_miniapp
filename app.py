from flask import Flask, request, jsonify
import sqlite3
import os
import requests as req

app = Flask(__name__)
DB_NAME = '/tmp/zeus.db'
TON_WALLET = 'UQCs2OTzgI5bmr5TJo3PigiEn0DMJhWktPOw7bo27K2FVZwl'

# درصد کمیسیون هر لول
COMMISSION_RATES = {1: 0.10, 2: 0.01, 3: 0.001}


def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    # جدول یوزرها
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            telegram_id INTEGER PRIMARY KEY,
            username TEXT,
            balance REAL DEFAULT 0,
            hashrate INTEGER DEFAULT 1,
            level INTEGER DEFAULT 1,
            items_owned TEXT DEFAULT "{}",
            parent_id INTEGER,
            left_child INTEGER,
            right_child INTEGER,
            left_count INTEGER DEFAULT 0,
            right_count INTEGER DEFAULT 0,
            total_left_points INTEGER DEFAULT 0,
            total_right_points INTEGER DEFAULT 0
        )
    ''')
    # جدول پرداخت‌های TON
    conn.execute('''
        CREATE TABLE IF NOT EXISTS ton_payments (
            comment TEXT PRIMARY KEY,
            telegram_id INTEGER,
            item_id TEXT,
            verified INTEGER DEFAULT 0,
            amount REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()


# قرار دادن یوزر جدید توی درخت باینری
def place_in_binary(conn, new_id, ref_id):
    if not ref_id:
        return
    ref = conn.execute('SELECT * FROM users WHERE telegram_id=?', (ref_id,)).fetchone()
    if not ref:
        return
    if not ref['left_child']:
        # بذار چپ
        conn.execute('UPDATE users SET left_child=?, left_count=left_count+1 WHERE telegram_id=?', (new_id, ref_id))
        conn.execute('UPDATE users SET parent_id=? WHERE telegram_id=?', (ref_id, new_id))
        update_upline(conn, ref_id, 'left')
    elif not ref['right_child']:
        # بذار راست
        conn.execute('UPDATE users SET right_child=?, right_count=right_count+1 WHERE telegram_id=?', (new_id, ref_id))
        conn.execute('UPDATE users SET parent_id=? WHERE telegram_id=?', (ref_id, new_id))
        update_upline(conn, ref_id, 'right')
    else:
        # هر دو پر - بذار زیر چپ
        place_in_binary(conn, new_id, ref['left_child'])


# آپدیت کردن خود رفرال‌دهنده‌ی مستقیم + همه بالادستی‌ها
def update_upline(conn, direct_parent_id, side):
    # شخصی که new_id رو مستقیماً زیر خودش گرفته (لول 1) - باید خودش هم حساب شه
    pid = direct_parent_id
    level = 1
    while pid and level <= 10:
        # کمیسیون
        rate = COMMISSION_RATES.get(level, 0)
        if rate > 0:
            bonus = 10 * rate
            conn.execute('UPDATE users SET balance=balance+? WHERE telegram_id=?', (bonus, pid))
        # آپدیت تعداد زیرمجموعه برای همین شخص
        if side == 'left':
            conn.execute('UPDATE users SET total_left_points=total_left_points+1 WHERE telegram_id=?', (pid,))
        else:
            conn.execute('UPDATE users SET total_right_points=total_right_points+1 WHERE telegram_id=?', (pid,))
        # چک لول‌آپ
        check_levelup(conn, pid)

        # برو یه لول بالاتر (پدر همین pid)
        parent_row = conn.execute('SELECT * FROM users WHERE telegram_id=?', (pid,)).fetchone()
        if not parent_row:
            break
        pid = parent_row['parent_id']
        level += 1


# چک کردن لول‌آپ
def check_levelup(conn, user_id):
    user = conn.execute('SELECT * FROM users WHERE telegram_id=?', (user_id,)).fetchone()
    if not user:
        return
    left = user['total_left_points']
    right = user['total_right_points']
    current_level = user['level']
    # هر 5 نفر چپ + 5 نفر راست = یه لول
    new_level = min(left, right) // 5
    if new_level > current_level:
        bonus = (new_level - current_level) * 500
        new_hash = new_level + 1
        conn.execute(
            'UPDATE users SET level=?, balance=balance+?, hashrate=? WHERE telegram_id=?',
            (new_level, bonus, new_hash, user_id)
        )


@app.route('/api/user/init', methods=['POST'])
def init_user():
    data = request.json
    telegram_id = data.get('telegram_id')
    username = data.get('username', 'User')
    ref = data.get('ref')
    if not telegram_id:
        return jsonify({"error": "Missing telegram_id"}), 400
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE telegram_id=?', (telegram_id,)).fetchone()
    if not user:
        # یوزر جدید با 1000 توکن شروع
        conn.execute('INSERT INTO users (telegram_id, username, balance) VALUES (?,?,?)',
                     (telegram_id, username, 1000))
        conn.commit()
        if ref and str(ref) != str(telegram_id):
            try:
                place_in_binary(conn, telegram_id, int(ref))
                conn.commit()
            except:
                pass
    user = conn.execute('SELECT * FROM users WHERE telegram_id=?', (telegram_id,)).fetchone()
    result = dict(user)
    conn.close()
    return jsonify(result)


@app.route('/api/user/save', methods=['POST'])
def save_user():
    data = request.json
    telegram_id = data.get('telegram_id')
    balance = data.get('balance', 0)
    hashrate = data.get('hashrate', 1)
    level = data.get('level', 1)
    item_levels = data.get('item_levels', '{}')
    if not telegram_id:
        return jsonify({"error": "Missing telegram_id"}), 400
    conn = get_db()
    conn.execute(
        'UPDATE users SET balance=?, hashrate=?, level=?, items_owned=? WHERE telegram_id=?',
        (balance, hashrate, level, str(item_levels), telegram_id)
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "ok"})


@app.route('/api/verify_ton', methods=['POST'])
def verify_ton():
    data = request.json
    comment = data.get('comment')
    telegram_id = data.get('telegram_id')
    item_id = data.get('item_id')
    expected_amount = data.get('expected_amount')
    if not all([comment, telegram_id, item_id]):
        return jsonify({"ok": False, "error": "Missing data"}), 400

    conn = get_db()
    # --- جلوگیری از سواستفاده: کامنت باید فقط یکبار برای همین یوزر و همین آیتم رزرو/تایید بشه ---
    existing = conn.execute('SELECT * FROM ton_payments WHERE comment=?', (comment,)).fetchone()
    if existing and existing['verified'] == 1:
        conn.close()
        # اگه قبلاً تایید شده، فقط برای همون یوزر/آیتم اصلی معتبره
        if str(existing['telegram_id']) == str(telegram_id) and existing['item_id'] == item_id:
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": "Comment already used"}), 400

    try:
        url = f'https://toncenter.com/api/v2/getTransactions?address={TON_WALLET}&limit=20'
        res = req.get(url, timeout=10)
        txs = res.json().get('result', [])
        found = False
        for tx in txs:
            msg = tx.get('in_msg', {})
            msg_comment = msg.get('message', '')
            amount = int(msg.get('value', 0)) / 1e9
            if msg_comment == comment and amount >= expected_amount * 0.95:
                found = True
                break
        if found:
            # کامنت رو با مالکیت یوزر و آیتم ثبت می‌کنیم تا قابل سواستفاده دوباره نباشه
            conn.execute(
                'INSERT OR REPLACE INTO ton_payments (comment, telegram_id, item_id, verified, amount) '
                'VALUES (?,?,?,1,?)',
                (comment, telegram_id, item_id, expected_amount)
            )
            conn.commit()
            conn.close()
            return jsonify({"ok": True})
        conn.close()
        return jsonify({"ok": False, "error": "Payment not found"})
    except Exception as e:
        conn.close()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route('/api/user/get', methods=['GET'])
def get_user():
    telegram_id = request.args.get('telegram_id')
    if not telegram_id:
        return jsonify({"error": "Missing telegram_id"}), 400
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE telegram_id=?', (telegram_id,)).fetchone()
    conn.close()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(dict(user))


@app.route('/api/network', methods=['GET'])
def get_network():
    telegram_id = request.args.get('telegram_id')
    if not telegram_id:
        return jsonify({"error": "Missing"}), 400
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE telegram_id=?', (telegram_id,)).fetchone()
    if not user:
        conn.close()
        return jsonify({"error": "Not found"}), 404
    left = None
    right = None
    if user['left_child']:
        l = conn.execute('SELECT telegram_id, username FROM users WHERE telegram_id=?',
                          (user['left_child'],)).fetchone()
        if l:
            left = dict(l)
    if user['right_child']:
        r = conn.execute('SELECT telegram_id, username FROM users WHERE telegram_id=?',
                          (user['right_child'],)).fetchone()
        if r:
            right = dict(r)
    conn.close()
    return jsonify({
        "left_child": left,
        "right_child": right,
        "total_left": user['total_left_points'],
        "total_right": user['total_right_points'],
        "level": user['level']
    })


ADMIN_ID = 8030373785


# ⚠️ یکبار-مصرف: بازسازی شمارش/کمیسیون/لول روی دیتابیس فعلی از روی parent_id
# فقط ادمین می‌تونه این رو صدا بزنه (با /api/admin/recalc?telegram_id=8030373785)
@app.route('/api/admin/recalc', methods=['POST'])
def admin_recalc():
    telegram_id = request.args.get('telegram_id') or (request.json or {}).get('telegram_id')
    if str(telegram_id) != str(ADMIN_ID):
        return jsonify({"error": "Forbidden"}), 403

    conn = get_db()
    # صفر کردن همه‌ی فیلدهای محاسبه‌شده، بدون دست زدن به ساختار درخت (left_child/right_child/parent_id)
    conn.execute('UPDATE users SET total_left_points=0, total_right_points=0')
    conn.commit()

    # همه‌ی یوزرها رو با ترتیب telegram_id بخون - برای هر کسی که parent_id دارد،
    # یعنی یه نفر زیرش اضافه شده بود، پس همون رویداد رو دوباره روی upline اعمال می‌کنیم
    all_users = conn.execute('SELECT telegram_id, parent_id, left_child, right_child FROM users').fetchall()

    for row in all_users:
        uid = row['telegram_id']
        pid = row['parent_id']
        if not pid:
            continue
        parent_row = conn.execute('SELECT left_child, right_child FROM users WHERE telegram_id=?', (pid,)).fetchone()
        if not parent_row:
            continue
        if parent_row['left_child'] == uid:
            side = 'left'
        elif parent_row['right_child'] == uid:
            side = 'right'
        else:
            continue
        update_upline(conn, pid, side)

    conn.commit()
    users_after = conn.execute('SELECT telegram_id, total_left_points, total_right_points, balance, level FROM users').fetchall()
    result = [dict(u) for u in users_after]
    conn.close()
    return jsonify({"status": "recalculated", "users": result})


init_db()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)


# force
