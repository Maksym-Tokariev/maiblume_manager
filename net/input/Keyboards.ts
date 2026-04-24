import {Buttons} from "./Buttons";
import {InlineKeyboardMarkup} from "node-telegram-bot-api";


export class Keyboards {

    public static get dates() {
        return {
            inline_keyboard: Buttons.days
        };
    }

    public static get members() {
        return Buttons.members
    }

    public static get confirmFlow() {
        return {
            inline_keyboard: [
                [Buttons.yes, Buttons.no]
            ]
        }
    }

    public static deleteMeet(id: string): InlineKeyboardMarkup {
        return {
            inline_keyboard: [
                [Buttons.deleteMeet(id)]
            ],
        }
    }
}