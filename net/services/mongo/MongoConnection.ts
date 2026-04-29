import {Db, MongoClient} from "mongodb";
import {Logger} from "../../utils/Logger";

export class MongoConnection {
    private readonly logger = new Logger(MongoConnection.name);
    protected readonly client: MongoClient;
    protected db?: Db;

    constructor(
        uri: string,
        private dbName: string
    ) {
        this.client = new MongoClient(uri);
    }
    public async connect() {
        try {
            await this.client.connect()
                .then(() => this.logger.info('Connection to the database has been successfully established'));
            this.db = this.client.db(this.dbName);
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
            throw err;
        }
    }

    public async disconnect() {
        await this.client.close();
        this.logger.info("Connection closed");
    }

    public getDb(): Db {
        if (!this.db) throw new Error("Database not connected");
        return this.db;
    }
}