import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../interfaces/IInputSource";
import TelegramBot from "node-telegram-bot-api";
import {MessageSender} from "../MessageSender";
import {Texts} from "../../utils/Texts";

export class StartStrategy extends BaseStrategy {

    constructor(
        bot: TelegramBot,
        private sender: MessageSender
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
       await this.sender.sendMessage(
           input.chatId,
           Texts.startText
       );
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.text)
            return event.text.startsWith('/start');
        return false
    }
}