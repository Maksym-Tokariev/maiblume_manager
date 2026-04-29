import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../interfaces/IInputSource";
import TelegramBot from "node-telegram-bot-api";
import {MessageSender} from "../MessageSender";
import {Texts} from "../../../utils/Texts";
import {membersId} from "../../../config/Members";
import {MongoMemberService} from "../../MongoMemberService";
import {Logger} from "../../../utils/Logger";

export class StartStrategy extends BaseStrategy {
    private readonly logger = new Logger(StartStrategy.name);

    constructor(
        bot: TelegramBot,
        private sender: MessageSender,
        private mongo: MongoMemberService
    ) {
        super(bot);
    }

    async handle(input: IInputSource): Promise<void> {
       await this.sender.sendMessage(
           input.chatId,
           Texts.startText
       );

       if (!input.from) {
           this.logger.warn('User is undefined');
           return;
       }
       await this.mongo.insert(input.from);
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.text)
            return event.text.startsWith('/start');
        return false
    }
}