import {Logger} from "../../utils/Logger";
import {IInputSource} from "../interfaces/IInputSource";
import {IStrategy} from "../interfaces/IStrategy";

export class StrategyFactory{
    private readonly logger = new Logger(StrategyFactory.name);

    constructor(
        private strategies: Set<IStrategy>
    ) {}

    async findStrategy(event: IInputSource) {
        this.logger.debug('Search for a strategy');
        for (const strategy of this.strategies) {
            if (await strategy.canHandle(event)) {
                this.logger.debug('A strategy has been found');
                await strategy.handle(event);
                return;
            }
        }
        this.logger.warn('Strategy not found');
    }
}