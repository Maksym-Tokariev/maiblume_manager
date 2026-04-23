import {Meeting} from "../models/Meeting";
import {Logger} from "../utils/Logger";

export class MeetManager {
    private readonly logger = new Logger(MeetManager.name);
    private meetings: Meeting[] = [];

    async create(data: Meeting) {
        if (data) {
            this.meets.push(data);
        }
        this.logger.error('Data is undefined', data);
    }

    public get meets(): Meeting[] {
        return this.meetings;
    }
}