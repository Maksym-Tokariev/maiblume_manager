import TelegramBot from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";
import {CreateFlowSteps} from "../enums/CreateFlowSteps";
import {State} from "../models/State";
import {Keyboards} from "../input/Keyboards";

export class MessageSender {
    private readonly logger = new Logger(MessageSender.name);

    constructor(private readonly bot: TelegramBot) {
    }

    public async sendMessage(chatId: any, text: string): Promise<void> {
        try {
            await this.bot.sendMessage(chatId, text);
        } catch (err: unknown) {
            // if (err instanceof SendMessageError) {
            //     this.logger.error(err.message, err.stack);
            // }
        }
    }

    async sendStepMessage(
        userId: number,
        chatId: number,
        step: CreateFlowSteps,
        input?: State,
    ): Promise<void> {
        try {
            switch (step) {
                case CreateFlowSteps.DATE:
                    await this.bot.sendMessage(
                        chatId, 'Выберете дату собрания', {
                            reply_markup: Keyboards.dates,
                        });
                    break;

                case CreateFlowSteps.TIME:
                    await this.bot.sendMessage(
                        chatId,
                        'Введите время встречи, например: 22, или 21:30',
                        {reply_markup: {keyboard: []}}
                    );
                    break;

                case CreateFlowSteps.MEMBERS:
                    await this.bot.sendMessage(
                        chatId,
                        'Перечислете учасников через пробел используя символ `@`',
                        {reply_markup: Keyboards.members}
                    );
                    break;
                case CreateFlowSteps.DESCRIPTION:
                    await this.bot.sendMessage(
                        chatId,
                        'Введите описание/цели встречи',
                        {reply_markup: {keyboard: []}}
                    );
                    break;
            }
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
        }
    }

}