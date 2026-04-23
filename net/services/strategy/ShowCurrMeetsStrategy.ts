import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../interfaces/IInputSource";
import TelegramBot from "node-telegram-bot-api";
import {MeetManager} from "../MeetManager";
import {MessageSender} from "../MessageSender";
import {Meeting} from "../../models/Meeting";

export class ShowCurrMeetsStrategy extends BaseStrategy {
    constructor(
        bot: TelegramBot,
        private meets: MeetManager,
        private sender: MessageSender
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        const meets: Meeting[] = this.meets.meets;

        for (const meet of meets) {
            await this.sender.sendMeet(input.chatId, meet)
        }
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.text) {
            return event.text === '/meetings';
        }
    }
}