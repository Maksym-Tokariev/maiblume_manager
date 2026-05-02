import TelegramBot, {CallbackQuery, Message} from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";
import {EventFactory} from "./private/event/EventFactory";
import {TextsRu} from "../utils/TextsRu";
import {MongoGroupService} from "./mongo/MongoGroupService";

export class InputListener {
    private readonly logger = new Logger(InputListener.name);

    constructor(
        private readonly bot: TelegramBot,
        private eventFactory: EventFactory,
        private mongo: MongoGroupService
    ) {
        this.logger.info("InputListener has been initialized");
    }

    public async listen(): Promise<void> {
        this.logger.debug("Start listening");
        this.bot.on("new_chat_members", async (msg) => {
            const newMembers = msg.new_chat_members;

            if (!newMembers) return;

            const botItself = await this.bot.getMe();
            if (botItself) {
                await this.bot.sendMessage(
                    msg.chat.id,
                    TextsRu.group.invite
                );
                await this.mongo.insert(msg.chat.title, msg.chat.id);
            }
        });
        this.bot.on('message', async (msg) => {
                if (msg.chat.type === "private")
                    await this.addEvent(msg);
            }
        );

        this.bot.on('callback_query', async (query) => {
            if (query.message?.chat.type === "private")
                await this.addEvent(query)
        });

        this.bot.on('my_chat_member', async (update) => {
            const chatId = update.chat.id;
            const newStatus = update.new_chat_member.status;

            if (newStatus === 'left' || newStatus === 'kicked') {
                this.logger.info('The bot was removed from a group');
                await this.mongo.delete(chatId);
            }
        });
    }

    async addEvent(input: Message | CallbackQuery): Promise<void> {
        await this.eventFactory.create(input);
    }
}