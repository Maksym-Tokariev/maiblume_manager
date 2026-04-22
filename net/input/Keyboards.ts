import {Buttons} from "./Buttons";


export class Keyboards {

    public static get dates() {
        return {
            inline_keyboard: Buttons.days
        };
    }

    public static get members() {
        return {
            keyboard: Buttons.members
        }
    }

    public static get confirmFlow() {
        return {
            inline_keyboard: [
                [Buttons.yes, Buttons.no]
            ]
        }
    }
}