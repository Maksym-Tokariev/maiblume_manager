import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../interfaces/IInputSource";
import TelegramBot from "node-telegram-bot-api";
import {MessageSender} from "../MessageSender";
import {Logger} from "../../../utils/Logger";
import {Texts} from "../../../utils/Texts";
import {MongoMeetService} from "../../mongo/MongoMeetService";

export class DeleteMeetStrategy extends BaseStrategy {
    private readonly logger = new Logger(DeleteMeetStrategy.name);

    constructor(
        bot: TelegramBot,
        private sender: MessageSender,
        private mongo: MongoMeetService
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        const meetId = input.data!.substring(7, input.data!.length);
        await this.mongo.deleteById(meetId);

        await this.sender.sendMessage(input.chatId, Texts.meet.remove);
        await this.answerQuery(input);
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (!event.data)
            return false;
        return event.data.includes('delete:');
    }
}