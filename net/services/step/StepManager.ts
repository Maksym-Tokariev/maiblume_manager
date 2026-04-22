import {Logger} from "../../utils/Logger";
import {IStepHandler} from "../interfaces/IStepHandler";
import {StateManager} from "../StateManager";
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
        this.logger.debug('Start searching cycle');
        for (const handler of this.handlers) {
            this.logger.debug('Searching for a step')
            if (handler.step === state.currStep) {
                this.logger.debug('A step has been found')
                await handler.handle(userId, chatId, state, input);
                return;
            }
        }
    }
}