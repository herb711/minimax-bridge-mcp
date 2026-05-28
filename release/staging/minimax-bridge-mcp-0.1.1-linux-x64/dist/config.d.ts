export type ResourceMode = "local" | "url";
export type T2AMode = "async" | "websocket";
export interface Config {
    apiKey: string;
    apiHost: string;
    basePath: string;
    resourceMode: ResourceMode;
    defaultPollIntervalSeconds: number;
    defaultMaxWaitSeconds: number;
    t2aMode: T2AMode;
    enableTokenPlanProxy: boolean;
    tokenPlanApiKey: string;
    tokenPlanCommand: string;
    tokenPlanArgs: string[];
}
export declare function loadConfig(): Config;
