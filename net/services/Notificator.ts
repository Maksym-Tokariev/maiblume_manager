import {Meeting} from "../models/Meeting";
import {MessageSender} from "./private/MessageSender";
import {TextsRu} from "../utils/TextsRu";
import {Logger} from "../utils/Logger";
import {MongoMemberService} from "./mongo/MongoMemberService";
import {Member} from "../models/Member";

export class Notificator {
    private readonly logger = new Logger(Notificator.name);
    constructor(
        private sender: MessageSender,
        private mongo: MongoMemberService
    ) {}

    public async notifyInGroup(meet: Meeting) {
        await this.sender.sendMessage(process.env.GROUP_ID, TextsRu.notifyAboutMeetGroup(meet));
        await this.notifyInPrivate(meet);
    }

    public async notifyInPrivate(meet: Meeting) {
        const members: string[] = meet.members;
        const users: Member[] = await this.mongo.getAllMembers();

        for (const user of await this.filterMembers(members, users, meet.createdBy)) {
            this.logger.debug('Notify user: ', user.username);

            if (!user.chatId) {
                this.logger.debug(`Member ${user.username} has no chatId`);
                continue;
            }

            await this.sender.sendMessage(user.chatId, TextsRu.notifyAboutMeetPrivate(meet));
            this.logger.debug('The user has been notified');
        }
    }

    private async filterMembers(members: string[], users: Member[], createdBy: string) {
        const userMap = new Map(users.map(u => [u.username, u]));
        return members
            .filter(username => userMap.has(username) && username !== createdBy)
            .map(username => userMap.get(username)!);
    }

    public async notifyAboutMeetBefore(members: string[]) {
        await this.sender.sendMessage(process.env.GROUP_ID, TextsRu.startsIn15(members));
    }

    public async notifyAboutStartMeet() {
        await this.sender.sendMessage(process.env.GROUP_ID, TextsRu.meet.start);
    }

    public async checkMeetings(upcoming: Meeting[]) {
        const today = new Date();
        for (const meet of upcoming) {
            const meetTime = await this.getMeetTime(meet.time);
            const diffMin = (meetTime.getTime() - today.getTime()) / (1000 * 60);

            if ((meet.date.getDate() === today.getDate()) && (diffMin <= 15 && diffMin > 14)) {
                this.logger.debug('Notice of an upcoming meeting', meet);
                await this.notifyAboutMeetBefore(meet.members);
                await this.notifyInPrivate(meet);
            }

            if ((meet.date.getDate() === today.getDate()) && diffMin <= 0 && diffMin > -1) {
                this.logger.debug('Notice of the commencement of the meeting', meet);
                await this.notifyAboutStartMeet();
            }
        }
    }

    public async getMeetTime(meetTime: string) {
        if (meetTime.includes(':')) {
            const [hours, minutes] = meetTime.split(":").map(Number);
            const now = new Date();
            now.setHours(hours, minutes, 0, 0);
            return now;
        }
        const hour = Number(meetTime);
        const now = new Date();
        now.setHours(hour, 0, 0, 0,);
        return now;
    }
}