import {IStrategy} from "../interfaces/IStrategy";
import {InitCreateMeetFlow} from "./InitCreateMeetFlow";
import TelegramBot from "node-telegram-bot-api";
import {StateManager} from "../StateManager";
import {StepManager} from "../step/StepManager";
import {FlowService} from "../flow/FlowService";
import {ShowCurrMeetsStrategy} from "./ShowCurrMeetsStrategy";
import {MeetManager} from "../MeetManager";
import {MessageSender} from "../MessageSender";
import {DeleteMeetStrategy} from "./DeleteMeetStrategy";
import {StartStrategy} from "./StartStrategy";

export class StrategyRegistry {
    private readonly _strategies: Set<IStrategy> = new Set<IStrategy>();

    constructor(
        bot: TelegramBot,
        private state: StateManager,
        private step: StepManager,
        private flow: FlowService,
        private meet: MeetManager,
        private sender: MessageSender

    ) {
        this._strategies.add(
            new InitCreateMeetFlow(bot, this.state, this.step, this.flow)
        );
        this._strategies.add(
          new ShowCurrMeetsStrategy(bot, this.meet, this.sender)
        );
        this._strategies.add(
            new DeleteMeetStrategy(bot, this.sender, this.meet)
        );
        this._strategies.add(
            new StartStrategy(bot, this.sender)
        );
    }

    public get strategies(): Set<IStrategy> {
        return this._strategies;
    }
}