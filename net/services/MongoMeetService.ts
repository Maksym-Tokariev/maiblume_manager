import {Meeting} from "../models/Meeting";
import {Notificator} from "./Notificator";
import cron from 'node-cron'
import {MongoBaseService} from "./MongoBaseService";

export class MongoMeetService extends MongoBaseService<Meeting>{
    constructor(
        uri: string,
        dbName: string,
        private notificator: Notificator
    ) {
        super(uri, dbName, 'meetings', MongoMeetService.name);
    }

    public async connect() {
        try {
            super.connect().then(() => this.logger.info('Connection established'));
            cron.schedule("*/10 * * * * *", () => this.checkMeetings(this));
            this.logger.info("Successful connection to the DB");
        } catch (err: any) {
            this.logger.error(err.message, err.stack);
            throw err;
        }
    }

    public async insert(meet: Meeting) {
        await this.getCollection().insertOne(meet);
        await this.notificator.notifyInGroup(meet);
    }

    public async deleteById(meetId: string) {
        await this.getCollection().deleteOne({id: meetId});
    }

    public async checkMeetings(mongo: MongoMeetService) {
        this.logger.debug('Check remind');
        const upcoming: Optional<Meeting[]> = await this.getCollection().find().toArray();
        if (!upcoming) {
            this.logger.debug('No meetings; reminder cancelled');
            return;
        }
        await this.notificator.checkMeetings(upcoming);
    }

    public get meets() {
        return this.getCollection().find();
    }
}