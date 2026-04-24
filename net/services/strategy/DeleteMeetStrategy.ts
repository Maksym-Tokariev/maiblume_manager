import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../interfaces/IInputSource";
import TelegramBot from "node-telegram-bot-api";
import {MessageSender} from "../MessageSender";
import {MeetManager} from "../MeetManager";
import {Logger} from "../../utils/Logger";

export class DeleteMeetStrategy extends BaseStrategy {
    private readonly logger = new Logger(DeleteMeetStrategy.name);

    constructor(
        bot: TelegramBot,
        private sender: MessageSender,
        private meet: MeetManager
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
        const meetId = input.data!.substring(7, input.data!.length);
        await this.meet.deleteMeetById(meetId);

        await this.sender.sendMessage(input.chatId, 'Собрание успешно удалено');
        await this.answerQuery(input);
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (!event.data)
            return false;
        return event.data.includes('delete:');
    }
}