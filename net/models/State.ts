import {CreateFlowSteps} from "../enums/CreateFlowSteps";
import {Meeting} from "./Meeting";
import {Flows} from "../enums/Flows";

export interface State {
    userId: number;
    chatId: number;
    currStep: CreateFlowSteps;
    currFlow?: Flows;
    data: Meeting;
}