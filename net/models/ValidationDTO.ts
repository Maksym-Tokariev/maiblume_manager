export interface ValidationDTO {
    valid: boolean;
    value?: {
        date?: Date;
        time?: string;
        members?: string;
    }
    error?: string
}