import TelegramBot, {SendMessageOptions} from "node-telegram-bot-api";
import {Logger} from "../../utils/Logger";
import {CreateFlowSteps} from "../../enums/CreateFlowSteps";
import {State} from "../../models/State";
import {Keyboards} from "../../input/Keyboards";
import {Meeting} from "../../models/Meeting";
import {TextsRu} from "../../utils/TextsRu";

export class MessageSender {
    private readonly logger = new Logger(MessageSender.name);

    constructor(private readonly bot: TelegramBot) {}

    public async sendMessage(chatId: any, text: string, options?: SendMessageOptions): Promise<void> {
        try {
            if (options) {
                await this.bot.sendMessage(chatId, text, options);
                return;
            }
            await this.bot.sendMessage(chatId, text);
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
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
                    await this.sendMessage(
                        chatId,
                        TextsRu.flowTexts.date,
                        {reply_markup: Keyboards.dates}
                    );
                    break;

                case CreateFlowSteps.TIME:
                    await this.sendMessage(
                        chatId,
                        TextsRu.flowTexts.time
                    );
                    break;

                case CreateFlowSteps.MEMBERS:
                    await this.sendMessage(
                        chatId,
                        TextsRu.flowTexts.members,
                        {reply_markup: {inline_keyboard: Keyboards.members}}
                    );
                    break;

                case CreateFlowSteps.DESCRIPTION:
                    await this.sendMessage(
                        chatId,
                        TextsRu.flowTexts.description,
                        {reply_markup: {keyboard: []}}
                    );
                    break;

                case CreateFlowSteps.CONFIRM:
                    await this.sendMessage(
                        chatId,
                        TextsRu.confirmMarkup(input?.data!),
                        {reply_markup: Keyboards.confirmFlow}
                    )
                    break;
            }
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
        }
    }

    async sendFlowComplete(chatId: number) {
        await this.sendMessage(
            chatId,
            TextsRu.flowTexts.complete,
            {reply_markup: {keyboard: []}}
        );
    }

    async sendFlowCancel(userId: number, chatId: number) {
        await this.sendMessage(
            chatId,
            TextsRu.meet.cancel
        );
    }

    public async sendMeet(chatId: number, meet: Meeting) {
        await this.sendMessage(
            chatId,
            TextsRu.meetMarkupText(meet),
            {reply_markup: Keyboards.deleteMeet(meet.id)}
        );
    }
}