import {Logger} from "../utils/Logger";
import {Meeting} from "../models/Meeting";
import {State} from "../models/State";
import {CreateFlowSteps} from "../enums/CreateFlowSteps";
import {Flows} from "../enums/Flows";

export class StateManager {
    private readonly logger = new Logger(StateManager.name);
    private states: Map<number, State[]> = new Map();

    public getStack(userId: number): State[] {
        return this.states.get(userId) ?? [];
    }

    public async getCurrState(userId: number): Promise<State> {
        const stack: State[] = this.getStack(userId);
        return stack[stack.length - 1];
    }

    public async isInFlow(userId: number): Promise<boolean> {
        const curr: State = await this.getCurrState(userId);
        return curr !== undefined && curr.currStep !== CreateFlowSteps.IDLE;
    }

    public async startFlow(userId: number, chatId: number, step: CreateFlowSteps, flowName: Flows) {
        this.logger.debug('Start flow to a user', userId);
        const stack = this.getStack(userId);
        stack.push({
            userId,
            chatId,
            currStep: step,
            currFlow: flowName,
            data: {} as Meeting
        });
        this.states.set(userId, stack);
        this.logger.debug('User flows: ', stack);
    }

    public async updateStep(userId: number){
        const state = await this.getCurrState(userId);
        if (state) state.currStep = this.getNextStep(state.currStep);
    }

    public async updateData(userId: number, data: Partial<State['data']>){
        const curr = await this.getCurrState(userId);
        if (curr) curr.data = {...curr.data, ...data};
    }

    public async completeFlow(userId: number) {
        const stack = this.getStack(userId);
        const curr = stack.pop();
        if (!curr) return null;

        this.logger.debug("Flow completed for user:", userId);
    }

    public async cancelFlow(userId: number) {
        const stack = this.getStack(userId);
        const curr = stack.pop();

        if (curr) {
            this.logger.debug("Flow cancelled for user:", userId);
        }
    }

    public async resetAllFlows(userId: number) {
        this.states.set(userId, []);
        this.logger.debug("All flows reset for user:", userId);
    }

    private getNextStep(step: CreateFlowSteps) {
        const steps = Object.values(CreateFlowSteps).filter(v => typeof v === 'number');
        const currIndex = steps.indexOf(step);
        return steps[currIndex + 1] ?? CreateFlowSteps.IDLE;
    }
}