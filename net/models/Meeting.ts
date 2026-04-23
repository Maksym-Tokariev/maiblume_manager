export interface Meeting {
    id: string;
    date: Date;
    time: string
    members: Set<string>;
    description?: string;
    createdBy: string;
}