import {EventManager} from "./EventManager";
import TelegramBot, {CallbackQuery, Message} from "node-telegram-bot-api";
import {Logger} from "../../../utils/Logger";
import {IInputSource} from "../interfaces/IInputSource";
import {MessageAdapter} from "../../../adapters/MessageAdapter";
import {CallbackAdapter} from "../../../adapters/CallbackAdapter";
import {StateManager} from "../StateManager";
import {FlowService} from "../flow/FlowService";
import {StrategyFactory} from "../strategy/StrategyFactory";

export class EventFactory {
    private readonly logger = new Logger(EventFactory.name);

    constructor(
        private events: EventManager,
        private state: StateManager,
        private flow: FlowService,
        private strategy: StrategyFactory
    ) {}

    async create(input: TelegramBot.Message | TelegramBot.CallbackQuery) {
        this.logger.debug('Add an event')
        const event: Optional<IInputSource> = await this.createEvent(input);
        if (!event) {
            this.logger.warn('Empty event');
            return;
        }

        if (event.userId && await this.state.isInFlow(event.userId)) {
            this.logger.debug('Is in flow')
            await this.flow.handleFlow(event, event.userId);
            return;
        }

        await this.strategy.findStrategy(event);
    }

    async createEvent(event: Message | CallbackQuery): Promise<Optional<IInputSource>> {
        if ('text' in event)
            return new MessageAdapter(event);
        if ('data' in event)
            return new CallbackAdapter(event);
        return undefined;
    }
}