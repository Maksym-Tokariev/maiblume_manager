
import {Meeting} from "../models/Meeting";
import {MessageSender} from "./private/MessageSender";
import {Texts} from "../utils/Texts";
import {membersId} from "../config/Members";
import {Logger} from "../utils/Logger";

export class Notificator {
    private readonly logger = new Logger(Notificator.name);
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

            if ((meet.date.getDate() === today.getDate()) && diffMin <= 0 && diffMin > -0.5) {
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

    public async notifyAboutMeetBefore(members: string[]) {
        await this.sender.sendMessage(process.env.GROUP_ID, `Собрание начнётся через 15 мин. Учасники: ${members.join(' ')}`);
    }

    public async notifyAboutStartMeet() {
        await this.sender.sendMessage(process.env.GROUP_ID, 'Собрание началось');
    }
}