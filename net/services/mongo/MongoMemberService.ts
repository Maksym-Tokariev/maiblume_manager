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

    public async delete(userId: number) {
        return this.getCollection().deleteOne({id: userId});
    }
}