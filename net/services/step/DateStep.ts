import {IStepHandler} from "../interfaces/IStepHandler";
import {CreateFlowSteps} from "../../enums/CreateFlowSteps";
import {State} from "../../models/State";
import {MessageSender} from "../MessageSender";
import {StateManager} from "../StateManager";

export class DateStep implements IStepHandler {
    step: CreateFlowSteps = CreateFlowSteps.DATE;

    constructor(
        private sender: MessageSender,
        private state: StateManager
    ) {}

    async handle(userId: number, chatId: number, state: State) {
        await this.sender.sendStepMessage(userId, chatId, this.step, state);
        await this.state.updateStep(userId, CreateFlowSteps.TIME);
    }

}