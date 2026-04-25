import {IStepHandler} from "../interfaces/IStepHandler";
import {CreateFlowSteps} from "../../../enums/CreateFlowSteps";
import {State} from "../../../models/State";
import {IInputSource} from "../interfaces/IInputSource";
import {Logger} from "../../../utils/Logger";
import {StateManager} from "../StateManager";
import {MessageSender} from "../MessageSender";

export class MembersStep implements IStepHandler {
    step: CreateFlowSteps = CreateFlowSteps.MEMBERS;
    private readonly logger = new Logger(MembersStep.name);

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
            this.logger.warn('Input data is undefined: ', input.data);
            return;
        }
        state.data.time = input.text;

        this.logger.debug('State: ', state);

        await this.sender.sendStepMessage(userId, chatId, this.step);
        await this.state.updateStep(userId);
    }
}