import TelegramBot from "node-telegram-bot-api";
import {MongoBaseService} from "./MongoBaseService";

export class MongoMemberService extends MongoBaseService<TelegramBot.User>{
    constructor(
        uri: string,
        dbName: string
    ) {
        super(uri, dbName, 'members', MongoMemberService.name);
    }

    public async insert(user: TelegramBot.User) {
        return this.getCollection().insertOne(user);
    }

    public async delete(userId: number) {
        return this.getCollection().deleteOne({id: userId});
    }
}