import TelegramBot from "node-telegram-bot-api";
import {Logger} from "../utils/Logger";
import {CreateFlowSteps} from "../enums/CreateFlowSteps";
import {State} from "../models/State";
import {Keyboards} from "../input/Keyboards";
import {Meeting} from "../models/Meeting";

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
                    );
                    break;

                case CreateFlowSteps.MEMBERS:
                    await this.bot.sendMessage(
                        chatId,
                        'Перечислете учасников через пробел используя символ `@`',
                        {
                            reply_markup: {
                                inline_keyboard: Keyboards.members,
                            }
                        }
                    );
                    break;

                case CreateFlowSteps.DESCRIPTION:
                    await this.bot.sendMessage(
                        chatId,
                        'Введите описание/цели встречи',
                        {reply_markup: {keyboard: []}}
                    );
                    break;

                case CreateFlowSteps.CONFIRM:
                    await this.bot.sendMessage(
                        chatId,
                        `Подтвердить создание собрания?\n` +
                        `Дата: ${input?.data.date.toDateString()}\n` +
                        `Время: ${input?.data.time}\n` +
                        `Учасники: ${[...input?.data.members!].join(' ')}\n` +
                        `Описание: ${input?.data.description}\n` +
                        `Кем создано: ${input?.data.createdBy}`,
                        {reply_markup: Keyboards.confirmFlow}
                    )
                    break;
            }
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
        }
    }

    async sendFlowComplete(chatId: number) {
        await this.bot.sendMessage(
            chatId,
            'Собрание успеешно создано\nПосмотреть список заплпнированых\n/meetings',
            {reply_markup: {keyboard: []}}
        );
    }

    async sendFlowCancel(userId: number, chatId: number) {
        await this.bot.sendMessage(
            chatId,
            'Собрание отменено',
        );
    }

    public async sendMeet(chatId: number, meet: Meeting) {
        await this.bot.sendMessage(
            chatId,
            `Дата: ${meet.date.toDateString()}\n` +
            `Время: ${meet.time}\n` +
            `Учасники: ${[...meet.members].join(' ')}\n` +
            `Описание: ${meet.description ?? ''}\n` +
            `Кем создано: ${meet.createdBy ?? 'unknown'}`,
            {reply_markup: Keyboards.deleteMeet(meet.id)}
        );
    }
}