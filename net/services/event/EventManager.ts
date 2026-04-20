import {IObservable} from "../interfaces/IObservable";
import {IEventListener} from "../interfaces/IEventListener";
import {Logger} from "../../utils/Logger";
import {IInputSource} from "../interfaces/IInputSource";

export class EventManager implements IObservable {
    private logger = new Logger(EventManager.name);
    private observers: Set<IEventListener> = new Set();

    async subscribe(observer: IEventListener): Promise<void> {
        this.logger.debug(`Add observer ${observer}`);
        this.observers.add(observer);
    }

    async unsubscribe(observer: IEventListener): Promise<void> {
        this.logger.debug(`Delete observer ${observer}`);
        this.observers.delete(observer);
    }

    async notify(event: IInputSource): Promise<void> {
        this.logger.debug('Notify observers');
        const notifications = Array.from(this.observers).map(
            observer => observer.update(event).catch(err => {
                this.logger.error(`Observer ${observer.constructor.name} failed`, err.stack);
            })
        )
        await Promise.all(notifications);
    }
}