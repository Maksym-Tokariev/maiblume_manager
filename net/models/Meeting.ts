export interface Meeting {
    id: string;
    date: Date;
    time: string
    members: string[];
    description?: string;
    createdBy: string;
}