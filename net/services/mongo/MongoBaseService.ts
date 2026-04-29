import {Collection, Db, Document, MongoClient} from "mongodb";
import {Logger} from "../../utils/Logger";

export abstract class MongoBaseService<T extends Document> {
    protected readonly logger: Logger;
    protected collection?: Collection<T>;

    protected constructor(
        db: Db,
        protected collectionName: string,
        serviceName: string
    ) {
        this.collection = db.collection<T>(this.collectionName);
        this.logger = new Logger(serviceName);
    }

    public getCollection(): Collection<T> {
        if (!this.collection) throw new Error("Collection not initialized");
        return this.collection;
    }
}