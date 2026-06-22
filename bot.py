import telebot
import requests
import os

BOT_TOKEN = '8625621495:AAFGXWA1iJTpfpQWdTchzGpF6TBPhw7k2D8'
API = 'https://web-production-7aada.up.railway.app'
MINI_APP_URL = 'https://seyedalimoosavi369.github.io/traxex_miniapp'
BOT_USERNAME = 'Minerobo_bot'

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def start(message):
    user_id = message.from_user.id
    username = message.from_user.first_name
    ref = None
    if len(message.text.split()) > 1:
        ref = message.text.split()[1]
    try:
        requests.post(API + '/api/user/init', json={
            'telegram_id': user_id,
            'username': username,
            'ref': ref
        }, timeout=5)
    except:
        pass
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
        f'Build your binary network!\n\n'
        f'🎁 You received *1000 ZEUS* to start!\n\n'
        f'🔗 Your referral:\n'
        f'`https://t.me/{BOT_USERNAME}?start={user_id}`',
        parse_mode='Markdown',
        reply_markup=keyboard
    )

@bot.callback_query_handler(func=lambda c: c.data == 'reflink')
def send_reflink(call):
    user_id = call.from_user.id
    link = f'https://t.me/{BOT_USERNAME}?start={user_id}'
    bot.answer_callback_query(call.id)
    bot.send_message(call.message.chat.id,
        f'🔗 *Your Referral Link:*\n`{link}`\n\n'
        f'• Level 1: *10%* commission\n'
        f'• Level 2: *1%* commission\n'
        f'• Level 3: *0.1%* commission\n\n'
        f'Left 5 + Right 5 = Level Up!\n'
        f'🎁 Level Up reward: *500 ZEUS* + hashrate!',
        parse_mode='Markdown'
    )

@bot.message_handler(commands=['stats'])
def stats(message):
    user_id = message.from_user.id
    try:
        res = requests.get(API + f'/api/user/get?telegram_id={user_id}', timeout=5)
        data = res.json()
        if 'error' in data:
            bot.send_message(message.chat.id, '❌ Send /start first.')
            return
        bot.send_message(message.chat.id,
            f'📊 *Your Stats:*\n\n'
            f'💰 Balance: *{int(data["balance"])} ZEUS*\n'
            f'⚡ Hashrate: *{data["hashrate"]}/s*\n'
            f'🏆 Level: *{data["level"]}*\n'
            f'👥 Left: *{data["total_left_points"]}*\n'
            f'👥 Right: *{data["total_right_points"]}*',
            parse_mode='Markdown'
        )
    except:
        bot.send_message(message.chat.id, '❌ Error.')

if __name__ == '__main__':
    print('Zeus bot started...')
    bot.infinity_polling()

