import {IStepHandler} from "../interfaces/IStepHandler";
import {CreateFlowSteps} from "../../enums/CreateFlowSteps";
import {State} from "../../models/State";
import {IInputSource} from "../interfaces/IInputSource";
import {Logger} from "../../utils/Logger";

export class DescStep implements IStepHandler{
    step: CreateFlowSteps = CreateFlowSteps.DESCRIPTION;
    private readonly logger = new Logger(DescStep.name);

    async handle(
        userId: number,
        chatId: number,
        state: State,
        input: IInputSource
    ): Promise<void> {
        if (!input.data) {
            this.logger.warn('Input data is undefined: ', input.data);
            return;
        }
        state.data.members = this.inputStringToStringArr(input.text);
    }

    private inputStringToStringArr(text: Optional<string>): Optional<Set<string>> {
        if (!text) {
            this.logger.warn('Members are undefined');
            return;
        }
        const res = new Set<string>();
        const members: string[] = text.split(' ');
        members.forEach((member: string) => res.add(member));

        return res;
    }

}