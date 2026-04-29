import {InlineKeyboardButton} from "node-telegram-bot-api";
import {members} from "../config/Members";

export class Buttons {
    public static get days(): InlineKeyboardButton[][] {
        const days = [];
        const today = new Date();

        for (let i = 0; i <= 5; i++) {
            const currDate = new Date(today);
            currDate.setDate(today.getDate() + i);
            days.push(currDate.toDateString().split('2026')[0]);
        }

        console.log(days);
        return days.map(d => [{text: d, callback_data: `date:${d}`}]);
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