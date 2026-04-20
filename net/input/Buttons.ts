import TelegramBot from "node-telegram-bot-api";

export class Buttons {
    public static getDaysButtons(): TelegramBot.InlineKeyboardButton[][] {
        const days = [];
        const today = new Date();

        for (let i = 0; i <= 5; i++) {
            const currDate = new Date(today);
            currDate.setDate(today.getDate() + 1);
            days.push(currDate.toISOString().split('T')[0]);
        }

        return [
            [ {text: days[0], callback_data: `date:${days[0]}`} ],
            [ {text: days[1], callback_data: `date:${days[1]}`} ],
            [ {text: days[2], callback_data: `date:${days[2]}`} ],
            [ {text: days[3], callback_data: `date:${days[3]}`} ],
            [ {text: days[4], callback_data: `date:${days[4]}`} ]
        ]
    }
}