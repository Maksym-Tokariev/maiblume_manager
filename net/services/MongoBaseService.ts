import {Collection, Db, Document, MongoClient} from "mongodb";
import {Logger} from "../utils/Logger";

export abstract class MongoBaseService<T extends Document> {
    protected readonly logger: Logger;
    protected readonly client: MongoClient;
    protected db?: Db;
    protected collection?: Collection<T>;

    protected constructor(
        uri: string,
        protected dbName: string,
        protected collectionName: string,
        serviceName: string
    ) {
        this.client = new MongoClient(uri);
        this.logger = new Logger(serviceName);
    }

    public async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            this.collection = this.db.collection<T>(this.collectionName);
            this.logger.info(`Connected to collection: ${this.collectionName}`);
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
            throw err;
        }
    }

    public async disconnect() {
        await this.client.close();
        this.logger.info("Connection closed");
    }

    public getCollection(): Collection<T> {
        if (!this.collection) throw new Error("Collection not initialized");
        return this.collection;
    }
}