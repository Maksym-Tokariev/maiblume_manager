import {IStepHandler} from "../interfaces/IStepHandler";
import {CreateFlowSteps} from "../../enums/CreateFlowSteps";
import {State} from "../../models/State";
import {IInputSource} from "../interfaces/IInputSource";
import {StateManager} from "../StateManager";
import {MessageSender} from "../MessageSender";

export class CloseFlowStep implements IStepHandler {
    step: CreateFlowSteps = CreateFlowSteps.CLOSE_FLOW;

    constructor(
        private state: StateManager,
        private sender: MessageSender
    ) {}

    async handle(
        userId: number,
        chatId: number,
        state: State,
        input?: IInputSource
    ) {
        await this.state.completeFlow(userId);

    }
}