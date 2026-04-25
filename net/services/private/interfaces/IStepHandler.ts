import {State} from "../../../models/State";
import {CreateFlowSteps} from "../../../enums/CreateFlowSteps";
import {IInputSource} from "./IInputSource";

export interface IStepHandler {
    step: CreateFlowSteps;
    handle(
        userId: number,
        chatId: number,
        state: State,
        input?: IInputSource
    ): Promise<void>;
}