import {IStepHandler} from "../interfaces/IStepHandler";
import {CreateFlowSteps} from "../../../enums/CreateFlowSteps";
import {State} from "../../../models/State";
import {IInputSource} from "../interfaces/IInputSource";
import {StateManager} from "../StateManager";
import {MessageSender} from "../MessageSender";
import {MongoService} from "../../MongoService";

export class CloseFlowStep implements IStepHandler {
    step: CreateFlowSteps = CreateFlowSteps.CLOSE_FLOW;

    constructor(
        private state: StateManager,
        private sender: MessageSender,
        private mongo: MongoService
    ) {}

    async handle(
        userId: number,
        chatId: number,
        state: State,
        input: IInputSource
    ) {
        if (input.data && input.data === 'yes') {
            await this.saveMeetAndCompleteFlow(userId, chatId, state);
            return;
        }
        await this.cancel(userId, chatId);
    }

    private async saveMeetAndCompleteFlow(userId: number, chatId: number, state: State,) {
        await this.sender.sendFlowComplete(chatId);
        await this.state.completeFlow(userId);
        await this.mongo.insert(state.data);
    }

    private async cancel(userId: number, chatId: number) {
        await this.sender.sendFlowCancel(userId, chatId);
        await this.state.cancelFlow(userId);
    }
}