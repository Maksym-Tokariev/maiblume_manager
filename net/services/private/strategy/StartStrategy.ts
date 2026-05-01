import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../interfaces/IInputSource";
import TelegramBot from "node-telegram-bot-api";
import {MessageSender} from "../MessageSender";
import {Texts} from "../../../utils/Texts";
import {membersId} from "../../../config/Members";
import {MongoMemberService} from "../../mongo/MongoMemberService";
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
        this.logger.debug('strategy -----')
       await this.sender.sendMessage(
           input.chatId,
           Texts.startText
       );

       if (!input.from) {
           this.logger.warn('User is undefined');
           return;
       }
       if (await this.isNew(input.from)) {
           this.logger.debug('A new user has been added');
           await this.mongo.insert(input.from);
       }
    }

    private async isNew(member: TelegramBot.User): Promise<boolean> {
        const members = await this.mongo.getAllMembers();
        return !members.some(m => m.id === member.id);
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.text)
            return event.text.startsWith('/start');
        return false
    }
}