import {Logger} from "../../../utils/Logger";
import {IStepHandler} from "../interfaces/IStepHandler";
import {StateManager} from "../StateManager";
import {State} from "../../../models/State";
import {MessageSender} from "../MessageSender";
import {DateStep} from "./DateStep";
import {TimeStep} from "./TimeStep";
import {IInputSource} from "../interfaces/IInputSource";
import {MembersStep} from "./MembersStep";
import {DescStep} from "./DescStep";
import {ConfirmStep} from "./ConfirmStep";
import {CloseFlowStep} from "./CloseFlowStep";
import {MongoService} from "../../MongoService";
import {ValidationService} from "../validation/ValidationService";

export class StepManager {
    private readonly logger = new Logger(StepManager.name);
    private handlers: Set<IStepHandler> = new Set<IStepHandler>();

    constructor(
        private state: StateManager,
        private sender: MessageSender,
        private mongo: MongoService,
        private validator: ValidationService
    ) {
        this.handlers.add(new DateStep(this.sender, this.state));
        this.handlers.add(new TimeStep(this.state, this.sender));
        this.handlers.add(new MembersStep(this.state, this.sender, this.validator));
        this.handlers.add(new DescStep(this.state, this.sender, this.validator));
        this.handlers.add(new ConfirmStep(this.state, this.sender));
        this.handlers.add(new CloseFlowStep(this.state, this.sender, this.mongo));
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