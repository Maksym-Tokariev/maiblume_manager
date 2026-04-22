import {Buttons} from "./Buttons";
import {members} from "../config/Members";


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
}