import {Buttons} from "./Buttons";

export class Keyboards {
    public static get dates() {
        return {
            inline_keyboard: Buttons.getDaysButtons()
        };
    }
}