import {MongoBaseService} from "./MongoBaseService";
import {Group} from "../../models/Group";
import {Db} from "mongodb";

export class MongoGroupService extends MongoBaseService<Group> {
    constructor(
        db: Db
    ) {
        super(db,'groups', MongoGroupService.name);
    }

    public async insert(title: string, groupId: number) {
        return await this.getCollection().insertOne({ title: title, groupId: groupId});
    }

    public delete(groupId: number) {
        return this.getCollection().deleteOne({groupId: groupId});
    }
}