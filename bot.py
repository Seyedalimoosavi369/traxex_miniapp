import telebot
import requests
import os

# مشخصات ربات
BOT_TOKEN = '8625621495:AAFGXWA1iJTpfpQWdTchzGpF6TBPhw7k2D8'
API = 'https://web-production-7aada.up.railway.app'
MINI_APP_URL = 'https://seyedalimoosavi369.github.io/traxex_miniapp'
BOT_USERNAME = 'Minerobo_bot'

bot = telebot.TeleBot(BOT_TOKEN)


# وقتی کسی /start میزنه
@bot.message_handler(commands=['start'])
def start(message):
    user_id = message.from_user.id          # آیدی عددی یوزر
    username = message.from_user.first_name  # اسم یوزر
    ref = None

    # اگه با لینک رفرال اومده مثلاً /start 8030373785
    if len(message.text.split()) > 1:
        ref = message.text.split()[1]

    # ثبت یوزر توی دیتابیس
    try:
        requests.post(API + '/api/user/init', json={
            'telegram_id': user_id,
            'username': username,
            'ref': ref
        }, timeout=5)
    except:
        pass

    # دکمه باز کردن مینی اپ
    keyboard = telebot.types.InlineKeyboardMarkup()

    keyboard.add(telebot.types.InlineKeyboardButton(
        '⚡ Play Zeus',
        web_app=telebot.types.WebAppInfo(url=MINI_APP_URL)
    ))

    keyboard.add(telebot.types.InlineKeyboardButton(
        '🔗 My Referral Link',
        callback_data='reflink'
    ))

    bot.send_message(message.chat.id,
        f'⚡ *Welcome to ZEUS, {username}!*\n\n'
        f'Mine ZEUS tokens by tapping!\n'
        f'Build your binary network and earn commissions!\n\n'
        f'🎁 You received *1000 ZEUS* tokens to start!\n\n'
        f'🔗 Your referral link:\n'
        f'`https://t.me/{BOT_USERNAME}?start={user_id}`',
        parse_mode='Markdown',
        reply_markup=keyboard
    )


# وقتی روی دکمه رفرال میزنه
@bot.callback_query_handler(func=lambda c: c.data == 'reflink')
def send_reflink(call):
    user_id = call.from_user.id
    link = f'https://t.me/{BOT_USERNAME}?start={user_id}'
    bot.answer_callback_query(call.id)
    bot.send_message(call.message.chat.id,
        f'🔗 *Your Referral Link:*\n`{link}`\n\n'
        f'Share this link! When someone joins:\n'
        f'• Level 1: You earn *10%* commission\n'
        f'• Level 2: You earn *1%* commission\n'
        f'• Level 3: You earn *0.1%* commission\n\n'
        f'When Left=5 and Right=5 → Level Up!\n'
        f'🎁 Level Up reward: *500 ZEUS* + hashrate boost!',
        parse_mode='Markdown'
    )


# وقتی کسی /stats میزنه
@bot.message_handler(commands=['stats'])
def stats(message):
    user_id = message.from_user.id
    try:
        res = requests.get(API + f'/api/user/get?telegram_id={user_id}', timeout=5)
        data = res.json()
        if 'error' in data:
            bot.send_message(message.chat.id, '❌ User not found. Send /start first.')
            return
        bot.send_message(message.chat.id,
            f'📊 *Your Stats:*\n\n'
            f'💰 Balance: *{int(data["balance"])}* ZEUS*\n'
            f'⚡ Hashrate: *{data["hashrate"]}/s*\n'
            f'🏆 Level: *{data["level"]}*\n'
            f'👥 Left Team: *{data["total_left_points"]}*\n'
            f'👥 Right Team: *{data["total_right_points"]}*',
            parse_mode='Markdown'
        )
    except:
        bot.send_message(message.chat.id, '❌ Error fetching stats.')


if __name__ == '__main__':
    print('Zeus bot started...')
    bot.infinity_polling()

