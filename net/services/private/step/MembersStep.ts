import {IStepHandler} from "../interfaces/IStepHandler";
import {CreateFlowSteps} from "../../../enums/CreateFlowSteps";
import {State} from "../../../models/State";
import {IInputSource} from "../interfaces/IInputSource";
import {Logger} from "../../../utils/Logger";
import {StateManager} from "../StateManager";
import {MessageSender} from "../MessageSender";
import {ValidationService} from "../validation/ValidationService";

export class MembersStep implements IStepHandler {
    step: CreateFlowSteps = CreateFlowSteps.MEMBERS;
    private readonly logger = new Logger(MembersStep.name);

    constructor(
        private state: StateManager,
        private sender: MessageSender,
        private validator: ValidationService
    ) {
    }

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
        const validation = await this.validator.validate(input.text, this.step);
        if (!validation.valid) {
            await this.sender.sendMessage(input.chatId, validation.error!);
            return;
        }
        state.data.time = input.text;

        this.logger.debug('State: ', state);

        await this.sender.sendStepMessage(userId, chatId, this.step);
        await this.state.updateStep(userId);
    }
}