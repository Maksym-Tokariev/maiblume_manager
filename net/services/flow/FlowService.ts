import {Logger} from "../../utils/Logger";
import {Flows} from "../../enums/Flows";
import {MessageSender} from "../MessageSender";
import {StateManager} from "../StateManager";
import {StepManager} from "../step/StepManager";
import {ValidationService} from "../validation/ValidationService";
import {CreateFlowSteps} from "../../enums/CreateFlowSteps";
import {IInputSource} from "../interfaces/IInputSource";

export class FlowService {
    private readonly logger = new Logger(FlowService.name);

    constructor(
        private sender: MessageSender,
        private state: StateManager,
        private step: StepManager,
        private validator: ValidationService
    ) {
    }

    async initFlow(userId: number, chatId: number, flowType: Flows) {
        await this.state.startFlow(userId, chatId, CreateFlowSteps.DATE, flowType);
        await this.setTimeout(userId, chatId);
    }

    async handleFlow(input: IInputSource, userId: number) {
        this.logger.debug('Handle flow');
        const chatId: number = input.chatId;

        const curState = await this.state.getCurrState(userId);
        await this.step.findStep(userId, chatId, curState, input);
    }

    private async setTimeout(userId: number, chatId: number): Promise<void> {
        setTimeout(async () => {
            const isInFlow = await this.state.isInFlow(userId);
            if (isInFlow) {
                await this.state.cancelFlow(userId);
                await this.sender.sendMessage(chatId, "Session time out. Start over");
            }
        }, 5 * 60 * 1000);
    }
}