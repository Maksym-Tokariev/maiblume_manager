import {BaseStrategy} from "./BaseStrategy";
import TelegramBot from "node-telegram-bot-api";
import {IInputSource} from "../interfaces/IInputSource";
import {StateManager} from "../StateManager";
import {Flows} from "../../enums/Flows";
import {StepManager} from "../step/StepManager";
import {FlowService} from "../flow/FlowService";

export class InitCreateMeetFlow extends BaseStrategy {
    constructor(
        bot: TelegramBot,
        private state: StateManager,
        private step: StepManager,
        private flow: FlowService
    ) {
        super(bot);
    }

    async handle(input: IInputSource) {
        const userId = input.userId;
        const chatId = input.chatId;
        if (!userId) return;

        await this.flow.initFlow(userId, chatId, Flows.CREATE_MEET);

        const currState = await this.state.getCurrState(userId);
        await this.step.findStep(userId, chatId, currState, input);
    }

    async canHandle(event: IInputSource): Promise<Optional<boolean>> {
        if (event.type === 'message' && event.text) {
            return event.text === '/create_meet';
        }
        return false;
    }
}