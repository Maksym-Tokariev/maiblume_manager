import {Logger} from "../../utils/Logger";

export class GroupManager {
    private readonly logger = new Logger(GroupManager.name);
    private groups: Map<number, string> = new Map();

    public async addGroup(title: Optional<string>, id: number) {
        if (!title) {
            this.groups.set(id, 'unknown');
            this.logger.info(`A group with id [${id}] was added`);
            return;
        }
        this.groups.set(id, title);
        this.logger.info(`A group with id [${id}] and name [${title}] was added`);
    }

    public deleteGroup(id: number) {
        this.groups.delete(id);
    }
}