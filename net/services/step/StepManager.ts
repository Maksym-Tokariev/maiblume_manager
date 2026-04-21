import {Logger} from "../../utils/Logger";
import {CreateFlowSteps} from "../../enums/CreateFlowSteps";
import {IStepHandler} from "../interfaces/IStepHandler";
import {StateManager} from "../StateManager";
import {ValidationDTO} from "../../models/ValidationDTO";
import {State} from "../../models/State";
import {MessageSender} from "../MessageSender";
import {DateStep} from "./DateStep";
import {TimeStep} from "./TimeStep";
import {IInputSource} from "../interfaces/IInputSource";
import {MembersStep} from "./MembersStep";

export class StepManager {
    private readonly logger = new Logger(StepManager.name);
    private handlers: Set<IStepHandler> = new Set<IStepHandler>();

    constructor(
        private state: StateManager,
        private sender: MessageSender
    ) {
        this.handlers.add(new DateStep(this.sender, this.state));
        this.handlers.add(new TimeStep(this.state, this.sender));
        this.handlers.add(new MembersStep(this.state, this.sender));
    }

    public async findStep(userId: number, chatId: number, state: State, input: IInputSource) {
        for (const handler of this.handlers) {
            if (handler.step === state.currStep)
                await handler.handle(userId, chatId, state, input);
        }
    }
}