import {MongoBaseService} from "./MongoBaseService";
import {Db} from "mongodb";
import {Member} from "../../models/Member";

export class MongoMemberService extends MongoBaseService<Member>{
    constructor(
        db: Db
    ) {
        super(db,'members', MongoMemberService.name);
    }

    public async insert(user: Member) {
        return this.getCollection().insertOne(user);
    }

    public async findByUsername(username: string) {
        this.logger.debug('Looking for user ', username);
        return this.getCollection().findOne({username: username});
    }

    public async getAllMembers(): Promise<Member[]> {
        return this.getCollection().find().toArray();
    }

    public async delete(userId: number) {
        return this.getCollection().deleteOne({id: userId});
    }
}