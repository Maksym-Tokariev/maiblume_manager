import TelegramBot from "node-telegram-bot-api";
import {Bot} from "../Bot";
import {InputListener} from "../services/InputListener";
import {EventFactory} from "../services/event/EventFactory";
import {EventManager} from "../services/event/EventManager";
import {StateManager} from "../services/StateManager";
import {MessageSender} from "../services/MessageSender";
import {StepManager} from "../services/step/StepManager";
import {FlowService} from "../services/flow/FlowService";
import {ValidationService} from "../services/validation/ValidationService";
import {StrategyRegistry} from "../services/strategy/StrategyRegistry";
import {StrategyFactory} from "../services/strategy/StrategyFactory";
import {MeetManager} from "../services/MeetManager";

export class ServiceContainer {
    private readonly bot: TelegramBot;
    private readonly inputListener: InputListener;
    private readonly eventFactory: EventFactory;
    private readonly eventManager: EventManager;
    private readonly state: StateManager;
    private readonly sender: MessageSender;
    private readonly step: StepManager;
    private readonly flow: FlowService;
    private readonly validator: ValidationService;
    private readonly strategyFactory: StrategyFactory;
    private readonly meet: MeetManager;

    constructor(bot: Bot) {
        this.bot = bot.getTelegramBot();


        this.eventManager = new EventManager();
        this.state = new StateManager();
        this.validator = new ValidationService();
        this.meet = new MeetManager();

        this.sender = new MessageSender(this.bot);
        this.step = new StepManager(this.state, this.sender, this.meet);
        this.flow = new FlowService(this.sender, this.state, this.step, this.validator);
        this.strategyFactory = new StrategyFactory(this.strategies);
        this.eventFactory = new EventFactory(this.eventManager, this.state, this.flow, this.strategyFactory);
        this.inputListener = new InputListener(this.bot, this.eventFactory);
    }

    get listener(): InputListener {
        return this.inputListener;
    }

    private get strategies() {
        return new StrategyRegistry(this.bot, this.state, this.step, this.flow).strategies;
    }
}