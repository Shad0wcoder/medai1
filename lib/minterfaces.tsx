export interface ResponseData {
    qkey: number;
    ic: number;
    q: string;
    ql: string[] | string[][];
    p?: string | null;
    r?: {
        desc: string;
        prec: string[];
    } | null;
}


export interface AnswerData {
    qkey: number;
    ic: number;
    answer?: string | Array<string>;
    ql: string[] | string[][];
    p?: string;
    r?: string;
    atype?: string;
}

export interface FormatData { 
    sender: string; 
    text?: string; 
    image?: string;
}

