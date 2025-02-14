export const enum Approaches {
    Medical = "pharma-doc-db",
    Axtria = "doc-db",
    ReadRetrieveRead = "rrr",
    ReadDecomposeAsk = "rda",
    RetrieveThenRead = "rtr",
    CodeConversion = "codeConv",
    CodeDoc = "codeDoc",
    CodeGen = "codeGen",
    Email = "email",
    Compensation = "compensation-plan-db",
    Catalogue="catalogue",
    Research = "oncology-doc-db",
    EdaAssistant = "eda",
    EdaRunQuery = "eq",
    SRD = "srd-doc-db",
    Joiner = "joiner",
    CT = "ct"
}

export type AskRequestOverrides = {
    semanticRanker?: boolean;
    semanticCaptions?: boolean;
    excludeCategory?: string;
    top?: number;
    temperature?: number;
    promptTemplate?: string;
    promptTemplatePrefix?: string;
    promptTemplateSuffix?: string;
    suggestFollowupQuestions?: boolean;
};

export type AskRequest = {
    question: string;
    approach: Approaches;
    overrides?: AskRequestOverrides;
};

export type AskResponse = {
    answer: string;
    thoughts: string | null;
    data_points: string[];
    error?: string;
};

export type ChatTurn = {
    user: string;
    bot?: string;
};

export type ChatRequest = {
    history: ChatTurn[];
    approach: Approaches;
    overrides?: AskRequestOverrides;
};

export type tableData = {
    chartType: string;
    chartData: any;
    chartOptions?: any;
};

export type GetApiResponse = {
    data: string;
};

export interface TableRowData {
    [key: string]: string | number;
}

export type EdaResponse = {
    answer: string;
    thoughts: string | null;
    data_points: string[];
    error?: string;
    tableData: tableData;
};
