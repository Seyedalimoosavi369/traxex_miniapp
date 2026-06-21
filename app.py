from flask import Flask, request, jsonify
import sqlite3
import os
import requests

app = Flask(__name__)
DB_NAME = '/tmp/zeus.db'
TON_WALLET = 'UQCs20TzgI5bmr5TJo3PigiEn0DMJhWktPOw7bo27K2FVZwI'

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            telegram_id INTEGER PRIMARY KEY,
            username TEXT,
            balance REAL DEFAULT 0,
            hashrate INTEGER DEFAULT 1,
            level INTEGER DEFAULT 1,
            items_owned TEXT DEFAULT '{}',
            parent_id INTEGER,
            total_left_points INTEGER DEFAULT 0,
            total_right_points INTEGER DEFAULT 0
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS ton_payments (
            comment TEXT PRIMARY KEY,
            verified INTEGER DEFAULT 0,
            amount REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/user/init', methods=['POST'])
def init_user():
    data = request.json
    telegram_id = data.get('telegram_id')
    username = data.get('username', 'User')
    ref = data.get('ref')
    if not telegram_id:
        return jsonify({"error": "Missing telegram_id"}), 400
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE telegram_id = ?', (telegram_id,)).fetchone()
    if not user:
        conn.execute('INSERT INTO users (telegram_id, username, parent_id) VALUES (?, ?, ?)', (telegram_id, username, ref))
        conn.commit()
        user = conn.execute('SELECT * FROM users WHERE telegram_id = ?', (telegram_id,)).fetchone()
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
    conn.execute('UPDATE users SET balance=?, hashrate=?, level=?, items_owned=? WHERE telegram_id=?',
        (balance, hashrate, level, str(item_levels), telegram_id))
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

    try:
        # چک کردن TON blockchain
        url = f'https://toncenter.com/api/v2/getTransactions?address={TON_WALLET}&limit=20'
        res = requests.get(url, timeout=10)
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
            # ذخیره پرداخت تأیید شده
            conn = get_db()
            conn.execute('INSERT OR REPLACE INTO ton_payments (comment, verified, amount) VALUES (?, 1, ?)',
                (comment, expected_amount))
            conn.commit()
            conn.close()
            return jsonify({"ok": True})
        else:
            return jsonify({"ok": False, "error": "Payment not found"})

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route('/api/user/get', methods=['GET'])
def get_user():
    telegram_id = request.args.get('telegram_id')
    if not telegram_id:
        return jsonify({"error": "Missing telegram_id"}), 400
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE telegram_id = ?', (telegram_id,)).fetchone()
    conn.close()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(dict(user))

init_db()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
# updated
