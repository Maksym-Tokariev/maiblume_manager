import {Logger} from "../utils/Logger";
import {Collection, Db, MongoClient} from "mongodb";
import {Meeting} from "../models/Meeting";
import {Notificator} from "./Notificator";


export class MongoService {
    private readonly logger = new Logger(MongoService.name);
    private readonly client: MongoClient;
    private db?: Db;
    private meetings?: Collection<Meeting>;

    constructor(
        uri: string,
        private dbName: string,
        private notificator: Notificator
    ) {
        this.client = new MongoClient(uri);
    }

    public async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            this.meetings = this.db.collection<Meeting>('meetings');
            await this.meetings.createIndex(
                {date: 1},
                {expireAfterSeconds: 0}
            );

            this.logger.info("Successful connection to the DB ");
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
            throw err;
        }
    }

    public async disconnect(): Promise<void> {
        await this.client.close();
        this.logger.info("Connected has been closed");
    }

    public async insert(meet: Meeting) {
        if (!this.meetings) throw new Error('No meetings collection');
        await this.meetings.insertOne(meet);
        await this.notificator.notifyInGroup(meet);
    }

    public async deleteById(meetId: string) {
        if (!this.meetings) throw new Error('No meetings collection');
        await this.meetings?.deleteOne({id: meetId});
    }

    public get meets() {
        return this.meetings?.find();
    }
}