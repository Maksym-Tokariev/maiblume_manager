import {IStrategy} from "../interfaces/IStrategy";
import {InitCreateMeetFlow} from "./InitCreateMeetFlow";
import TelegramBot from "node-telegram-bot-api";
import {StateManager} from "../StateManager";
import {StepManager} from "../step/StepManager";
import {FlowService} from "../flow/FlowService";

export class StrategyRegistry {
    private readonly _strategies: Set<IStrategy> = new Set<IStrategy>();

    constructor(
        private bot: TelegramBot,
        private state: StateManager,
        private step: StepManager,
        private flow: FlowService
    ) {
        this._strategies.add(new InitCreateMeetFlow(bot, this.state, this.step, this.flow));
    }

    public get strategies(): Set<IStrategy> {
        return this._strategies;
    }
}