import {Logger} from "../utils/Logger";
import {Collection, Db, MongoClient} from "mongodb";
import {Meeting} from "../models/Meeting";
import {Notificator} from "./Notificator";
import cron from 'node-cron'

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
            // await this.meetings.createIndex(
            //     {date: 1},
            //     {expireAfterSeconds: 0}
            // );
            // await this.meetings.dropIndex("date_1");


            cron.schedule("*/10 * * * * *", () => this.checkMeetings(this));
            this.logger.info("Successful connection to the DB");
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

    public async checkMeetings(mongo: MongoService) {
        this.logger.debug('Check remind');
        const upcoming: Optional<Meeting[]> = await this.meetings?.find().toArray();
        if (!upcoming) {
            this.logger.debug('No meetings; reminder cancelled');
            return;
        }
        await this.notificator.checkMeetings(upcoming);
    }

    public get meets() {
        return this.meetings?.find();
    }
}