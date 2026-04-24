import {InlineKeyboardButton} from "node-telegram-bot-api";
import {members} from "../config/Members";

export class Buttons {
    public static get days(): InlineKeyboardButton[][] {
        const days = [];
        const today = new Date();

        for (let i = 0; i <= 5; i++) {
            const currDate = new Date(today);
            currDate.setDate(today.getDate() + i);
            days.push(currDate.toDateString().split('T')[0]);
        }

        return [
            [{text: days[0], callback_data: `date:${days[0]}`}],
            [{text: days[1], callback_data: `date:${days[1]}`}],
            [{text: days[2], callback_data: `date:${days[2]}`}],
            [{text: days[3], callback_data: `date:${days[3]}`}],
            [{text: days[4], callback_data: `date:${days[4]}`}]
        ]
    }

    public static get members(): InlineKeyboardButton[][] {
        return [
            [{text: 'Добавить всех', switch_inline_query_current_chat: [...members].join(' ')}],
        ]
    }

    public static get yes(): InlineKeyboardButton {
        return {
            text: 'Да', callback_data: 'yes'
        };
    }

    public static get no(): InlineKeyboardButton {
        return {
            text: 'Нет', callback_data: 'no'
        };
    }

    public static deleteMeet(id: string): InlineKeyboardButton {
        return {
            text: 'Удалить собрание', callback_data: `delete:${id}`
        };
    }
}