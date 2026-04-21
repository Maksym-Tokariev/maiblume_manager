export interface Meeting {
    date: Date;
    time?: string
    members?: Set<string>;
    description?: string;
    createdBy: string;
}