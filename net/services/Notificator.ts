import {Meeting} from "../models/Meeting";
import {MessageSender} from "./private/MessageSender";
import {Texts} from "../utils/Texts";
import {membersId} from "../config/Members";

export class Notificator {
    constructor(
        private sender: MessageSender
    ) {}

    public async notifyInGroup(meet: Meeting) {
        await this.sender.sendMessage(process.env.GROUP_ID, Texts.notifyAboutMeetGroup(meet));
        await this.notifyInPrivate(meet);
    }

    public async notifyInPrivate(meet: Meeting) {
        const members = meet.members;

        for (const member of members) {
            if (!membersId.get(member)) continue;
            await this.sender.sendMessage(membersId.get(member), Texts.notifyAboutMeetPrivate(meet));
        }
    }
}