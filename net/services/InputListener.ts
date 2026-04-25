import TelegramBot, {CallbackQuery, Message} from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";
import {EventFactory} from "./event/EventFactory";
import {Texts} from "../utils/Texts";

export class InputListener {
    private readonly logger = new Logger(InputListener.name);

    constructor(
        private readonly bot: TelegramBot,
        private eventFactory: EventFactory
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
                    Texts.group.invite
                );
            }
        });
        this.bot.on('message',
            async (msg) => await this.addEvent(msg));

        this.bot.on('callback_query',
            async (query) => await this.addEvent(query));
    }

    async addEvent(input: Message | CallbackQuery): Promise<void> {
        await this.eventFactory.create(input);
    }
}