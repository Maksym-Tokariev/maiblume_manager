import TelegramBot from "node-telegram-bot-api";
import {members} from "../config/Members";

export class Buttons {
    public static get days(): TelegramBot.InlineKeyboardButton[][] {
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

    public static get members(): TelegramBot.KeyboardButton[][] {
        return [
            [ {text: members[0]} ],
            [ {text: members[1]} ],
            [ {text: members[2]} ],
            [ {text: members[3]} ],
            [ {text: members[4]} ],
            [ {text: members[5]} ]
        ]
    }

    public static get yes(): TelegramBot.InlineKeyboardButton {
        return {
            text: 'Да', callback_data: 'yes'
        };
    }

    public static get no(): TelegramBot.InlineKeyboardButton {
        return {
            text: 'Нет', callback_data: 'no'
        };
    }
}