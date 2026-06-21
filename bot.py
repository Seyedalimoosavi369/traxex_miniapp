import telebot
import requests
import os

BOT_TOKEN = '8625621495:AAFGXWA1iJTpfpQWdTchzGpF6TBPhw7k2D8'
API = 'https://web-production-7aada.up.railway.app'
MINI_APP_URL = 'https://seyedalimoosavi369.github.io/traxex_miniapp'

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
        })
    except:
        pass
    keyboard = telebot.types.InlineKeyboardMarkup()
    keyboard.add(telebot.types.InlineKeyboardButton(
        '⚡ Play Zeus',
        web_app=telebot.types.WebAppInfo(url=MINI_APP_URL)
    ))
    bot.send_message(message.chat.id,
        f'⚡ *Welcome to ZEUS!*\n\nMine ZEUS tokens!\n\n🔗 Your referral:\n`https://t.me/Minerobo_bot?start={user_id}`',
        parse_mode='Markdown',
        reply_markup=keyboard
    )

if __name__ == '__main__':
    print('Zeus bot started...')
    bot.polling(none_stop=True)
