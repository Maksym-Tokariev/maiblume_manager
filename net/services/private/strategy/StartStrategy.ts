import {BaseStrategy} from "./BaseStrategy";
import {IInputSource} from "../interfaces/IInputSource";
import TelegramBot from "node-telegram-bot-api";
import {MessageSender} from "../MessageSender";
import {TextsRu} from "../../../utils/TextsRu";
import {MongoMemberService} from "../../mongo/MongoMemberService";
import {Logger} from "../../../utils/Logger";
import {Member} from "../../../models/Member";

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
           TextsRu.startText
       );

       if (!input.from) {
           this.logger.warn('User is undefined');
           return;
       }

        if (await this.isNew(input.from.id)) {
            const member: Member = this.createMember(input);
            await this.mongo.insert(member);
            this.logger.debug('A new user has been added');
        }
    }

    private async isNew(userId: number): Promise<boolean> {
        const members: Member[] = await this.mongo.getAllMembers();
        return !members.some(m => m.userId === userId);
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.text)
            return event.text.startsWith('/start');
        return false
    }

    private createMember(input: IInputSource): Member {
        return {
            username: input.from!.username!,
            userId: input.userId!,
            chatId: input.chatId,
            firstName: input.from?.first_name,
            lastName: input.from?.last_name
        };
    }
}