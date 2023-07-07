export interface Config {
    outline: boolean;
    title: boolean;
    author: boolean;
    fullContent: boolean;
}
export interface PdfMetadata {
    fileName: string;
    outline?: string[];
    title?: string;
    author?: string;
    fullContent?: string;
}
