import TelegramBot from "node-telegram-bot-api";
import {Bot} from "../Bot";
import {InputListener} from "../services/InputListener";
import {EventFactory} from "../services/private/event/EventFactory";
import {EventManager} from "../services/private/event/EventManager";
import {StateManager} from "../services/private/StateManager";
import {MessageSender} from "../services/private/MessageSender";
import {StepManager} from "../services/private/step/StepManager";
import {FlowService} from "../services/private/flow/FlowService";
import {ValidationService} from "../services/private/validation/ValidationService";
import {StrategyRegistry} from "../services/private/strategy/StrategyRegistry";
import {StrategyFactory} from "../services/private/strategy/StrategyFactory";
import {MeetManager} from "../services/private/MeetManager";
import {GroupManager} from "../services/group/GroupManager";
import {Notificator} from "../services/Notificator";
import {MongoService} from "../services/MongoService";
import {appConfig} from "../config/AppConfig";

export class ServiceContainer {
    private readonly bot: TelegramBot;
    private readonly mongo: MongoService;
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
    private readonly groupManager;
    private readonly notificator: Notificator;

    constructor(bot: Bot) {
        this.bot = bot.getTelegramBot();

        this.mongo = new MongoService(appConfig.mongo.uri, appConfig.mongo.dbName);
        this.mongo.connect();

        this.eventManager = new EventManager();
        this.state = new StateManager();
        this.groupManager = new GroupManager();
        this.validator = new ValidationService();

        this.sender = new MessageSender(this.bot);
        this.notificator = new Notificator(this.sender);
        this.meet = new MeetManager(this.notificator);
        this.step = new StepManager(this.state, this.sender, this.meet);
        this.flow = new FlowService(this.sender, this.state, this.step, this.validator);
        this.strategyFactory = new StrategyFactory(this.strategies);
        this.eventFactory = new EventFactory(this.eventManager, this.state, this.flow, this.strategyFactory);
        this.inputListener = new InputListener(this.bot, this.eventFactory, this.groupManager);
    }

    get listener(): InputListener {
        return this.inputListener;
    }

    private get strategies() {
        return new StrategyRegistry(
            this.bot,
            this.state,
            this.step,
            this.flow,
            this.meet,
            this.sender
        ).strategies;
    }
}