import {IStepHandler} from "../interfaces/IStepHandler";
import {CreateFlowSteps} from "../../../enums/CreateFlowSteps";
import {State} from "../../../models/State";
import {IInputSource} from "../interfaces/IInputSource";
import {Logger} from "../../../utils/Logger";
import {StateManager} from "../StateManager";
import {MessageSender} from "../MessageSender";
import {ValidationService} from "../validation/ValidationService";

export class DescStep implements IStepHandler {
    step: CreateFlowSteps = CreateFlowSteps.DESCRIPTION;
    private readonly logger = new Logger(DescStep.name);

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

        const membersInput = input.text.split(' ');
        const validation = await this.validator.validate(membersInput, this.step);
        if (!validation.valid) {
            await this.sender.sendMessage(input.chatId, validation.error!);
            return;
        }
        state.data.members = membersInput.map(member =>
            member.startsWith('@') ? member.slice(1) : member);

        this.logger.debug('State: ', state);

        await this.sender.sendStepMessage(userId, chatId, this.step);
        await this.state.updateStep(userId);
    }

    private inputStringToStringArr(text: string): Set<string> {
        const res = new Set<string>();
        const members: string[] = text.split(' ');
        members.forEach((member: string) => res.add(member));

        return res;
    }

}