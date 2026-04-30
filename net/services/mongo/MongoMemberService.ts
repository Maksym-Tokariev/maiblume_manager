import TelegramBot from "node-telegram-bot-api";
import {MongoBaseService} from "./MongoBaseService";
import {Db} from "mongodb";

export class MongoMemberService extends MongoBaseService<TelegramBot.User>{
    constructor(
        db: Db
    ) {
        super(db,'members', MongoMemberService.name);
    }

    public async insert(user: TelegramBot.User) {
        return this.getCollection().insertOne(user);
    }

    public async findByUsername(username: string) {
        return this.getCollection().findOne({username: username});
    }

    public async getAllMembers(): Promise<TelegramBot.User[]> {
        return this.getCollection().find().toArray();
    }

    public async delete(userId: number) {
        return this.getCollection().deleteOne({id: userId});
    }
}