import {IStepHandler} from "../interfaces/IStepHandler";
import {CreateFlowSteps} from "../../enums/CreateFlowSteps";
import {State} from "../../models/State";
import {IInputSource} from "../interfaces/IInputSource";
import {Logger} from "../../utils/Logger";
import {StateManager} from "../StateManager";
import {MessageSender} from "../MessageSender";

export class ConfirmStep implements IStepHandler {
    step: CreateFlowSteps = CreateFlowSteps.CONFIRM;
    private readonly logger = new Logger(ConfirmStep.name);

    constructor(
        private state: StateManager,
        private sender: MessageSender
    ) {}

    async handle(
        userId: number,
        chatId: number,
        state: State,
        input: IInputSource
    ) {
        if (!input.text) {
            this.logger.warn('Input data is undefined: ', input.text);
            return;
        }

        state.data.description = input.text;
        if (input.from!.username)
            state.data.createdBy = input.from!.username;

        this.logger.debug('State: ', state);

        await this.sender.sendStepMessage(userId, chatId, this.step, state);
        await this.state.updateStep(userId);
    }
}