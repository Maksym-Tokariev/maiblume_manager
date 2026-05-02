import {Meeting} from "../../models/Meeting";
import {Notificator} from "../Notificator";
import cron from 'node-cron'
import {MongoBaseService} from "./MongoBaseService";
import {Db} from "mongodb";

export class MongoMeetService extends MongoBaseService<Meeting>{
    constructor(
        db: Db,
        private notificator: Notificator
    ) {
        super(db,'meetings', MongoMeetService.name);
        cron.schedule("* * * * *", () => this.checkMeetings(this));
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