import {IStepHandler} from "../interfaces/IStepHandler";
import {CreateFlowSteps} from "../../enums/CreateFlowSteps";
import {State} from "../../models/State";
import {StateManager} from "../StateManager";
import {IInputSource} from "../interfaces/IInputSource";
import {Logger} from "../../utils/Logger";
import {MessageSender} from "../MessageSender";

export class TimeStep implements IStepHandler {
    step: CreateFlowSteps = CreateFlowSteps.TIME;
    private readonly logger = new Logger(TimeStep.name);

    constructor(
        private state: StateManager,
        private sender: MessageSender
    ) {}

    async handle(userId: number, chatId: number, state: State, input: IInputSource): Promise<void> {
        if (!input.data) {
            this.logger.warn('Input data is undefined: ', input.data);
            return;
        }
        state.data.date = new Date(input.data.substring(5, input.data.length));

        await this.sender.sendStepMessage(userId, chatId, this.step);
        await this.state.updateStep(userId);
    }

}