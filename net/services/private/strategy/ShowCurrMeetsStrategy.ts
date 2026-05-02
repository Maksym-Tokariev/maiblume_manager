import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../interfaces/IInputSource";
import TelegramBot from "node-telegram-bot-api";
import {MessageSender} from "../MessageSender";
import {Meeting} from "../../../models/Meeting";
import {TextsRu} from "../../../utils/TextsRu";
import {MongoMeetService} from "../../mongo/MongoMeetService";

export class ShowCurrMeetsStrategy extends BaseStrategy {
    constructor(
        bot: TelegramBot,
        private mongo: MongoMeetService,
        private sender: MessageSender
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        const meets = this.mongo.meets;

        if (!meets) {
            await this.sender.sendMessage(input.chatId, TextsRu.meet.empty);
            return;
        }

        meets.stream().forEach((meet: Meeting) => { this.sender.sendMeet(input.chatId, meet)});
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.text) {
            return event.text === '/meetings';
        }
    }
}