import TelegramBot from "node-telegram-bot-api";
import {appConfig} from "./config/AppConfig";
import {Logger} from "./utils/Logger";
import {ServiceContainer} from "./utils/ServiceContainer";
import {CommandRegistry} from "./utils/CommandRegistry";
import {aws4Sign} from "mongodb/src/cmap/auth/aws4";


export class Bot {
    private readonly bot: TelegramBot;
    private readonly logger = new Logger(Bot.name);

    public constructor(
        private readonly container: ServiceContainer
    ) {
        this.bot = new TelegramBot(appConfig.token, {polling: true});
    }

    public async start(): Promise<void> {
        await this.initialize();
    }

    private async initialize() {
        this.logger.debug("Start initializing");
        try {
            new CommandRegistry(this.bot);
            this.setupErrorHandling();
            await this.setupMessageListener();
            this.logger.debug("Successful initialization");
        } catch (err: any) {
            this.logger.error("Initializing error: ", err.message);
            await this.stop();
        }
    }

    private setupErrorHandling(): void {
        this.bot.on("polling_error", (err: Error) => {
            this.logger.error(`Polling error: [${err}]`);
        });
    }

    private async setupMessageListener() {
        await this.container.listener.listen();
    }

    public async stop(): Promise<void> {
        if (this.bot.isPolling()) {
            await this.bot.stopPolling();
        }

        this.logger.info("Bot stopped");
    }

    public getTelegramBot(): TelegramBot {
        return this.bot;
    }
}