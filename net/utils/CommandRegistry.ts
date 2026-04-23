import TelegramBot, {BotCommand} from "node-telegram-bot-api";
import {Logger} from "./Logger";
import {Commands} from "../enums/Commands";

export class CommandRegistry {
    private readonly logger = new Logger(CommandRegistry.name);
    private bot: TelegramBot;
    private commands: BotCommand[] = [];

    constructor(bot: TelegramBot) {
        this.bot = bot;
        this.setCommandsList()
            .then(() => this.logger.info('Commands have been initialized'))
            .catch((e: Error) => this.logger.error(e.message, e.stack));
    }

    public async setCommandsList(): Promise<void>  {
        this.logger.debug("Command initialization");
        this.commands.push({
            command: Commands.START,
            description: "Запуск бота"
        });
        this.commands.push({
            command: Commands.HELP,
            description: "Помощь в использовании"
        });

        this.commands.push({
            command: Commands.CREATE_MEET,
            description: "Назначить собрание"
        });

        this.commands.push({
            command: Commands.MEETINGS,
            description: "Просмотреть список актуальных собраний"
        });

        try {
            await this.bot.setMyCommands(this.commands);
        } catch (err: any) {
            throw Error(err);
        }
    }

    public getCommands(): BotCommand[] {
        return this.commands;
    }
}