import {Meeting} from "../models/Meeting";
import {Logger} from "../utils/Logger";

export class MeetManager {
    private readonly logger = new Logger(MeetManager.name);
    private meetings: Meeting[] = [];

    async create(data: Meeting) {
        if (data) {
            this.meets.push(data);
            return;
        }
        this.logger.error('Data is undefined', data);
    }

    public async deleteMeetById(id: string) {
        this.meetings = this.meetings.filter(m => m.id !== id);
    }

    public async findMeetById(id: string): Promise<Optional<Meeting>> {
        return this.meetings.find(m => m.id === id);
    }

    public get meets(): Meeting[] {
        return this.meetings;
    }
}