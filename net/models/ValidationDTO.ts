export interface ValidationDTO {
    valid: boolean;
    value?: {
        time?: string;
        members?: string[];
    }
    error?: string
}