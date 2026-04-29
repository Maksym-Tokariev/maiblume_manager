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
import {GroupManager} from "../services/group/GroupManager";
import {Notificator} from "../services/Notificator";
import {MongoMeetService} from "../services/mongo/MongoMeetService";
import {MongoMemberService} from "../services/mongo/MongoMemberService";
import {MongoConnection} from "../services/mongo/MongoConnection";

export class ServiceContainer {
    private readonly telegramBot: TelegramBot;
    private readonly bot: Bot;
    private readonly mConnector: MongoConnection;
    private readonly mongoMeetService: MongoMeetService;
    private readonly mongoMemberService: MongoMemberService;
    private readonly inputListener: InputListener;
    private readonly eventFactory: EventFactory;
    private readonly eventManager: EventManager;
    private readonly state: StateManager;
    private readonly sender: MessageSender;
    private readonly step: StepManager;
    private readonly flow: FlowService;
    private readonly validator: ValidationService;
    private readonly strategyFactory: StrategyFactory;
    private readonly groupManager;
    private readonly notificator: Notificator;

    constructor(connector: MongoConnection) {
        this.mConnector = connector;
        this.bot = new Bot(this);
        this.telegramBot = this.bot.getTelegramBot()

        this.eventManager = new EventManager();
        this.state = new StateManager();
        this.groupManager = new GroupManager();
        this.validator = new ValidationService();

        this.sender = new MessageSender(this.telegramBot);
        this.mongoMemberService = new MongoMemberService(connector.getDb());
        this.notificator = new Notificator(this.sender);
        this.mongoMeetService = new MongoMeetService(connector.getDb(), this.notificator);
        this.step = new StepManager(this.state, this.sender, this.mongoMeetService, this.validator);
        this.flow = new FlowService(this.sender, this.state, this.step, this.validator);
        this.strategyFactory = new StrategyFactory(this.strategies);
        this.eventFactory = new EventFactory(this.eventManager, this.state, this.flow, this.strategyFactory);
        this.inputListener = new InputListener(this.telegramBot, this.eventFactory, this.groupManager);
    }

    get myBot(): Bot {
        return this.bot;
    }

    get listener(): InputListener {
        return this.inputListener;
    }

    get connector() {
        return this.mConnector;
    }

    private get strategies() {
        return new StrategyRegistry(
            this.telegramBot,
            this.state,
            this.step,
            this.flow,
            this.mongoMeetService,
            this.sender,
            this.mongoMemberService
        ).strategies;
    }
}