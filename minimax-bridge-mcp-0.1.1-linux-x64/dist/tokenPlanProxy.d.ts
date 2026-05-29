import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { Config } from "./config.js";
export declare class TokenPlanProxy {
    private readonly config;
    private client?;
    private transport?;
    private connecting?;
    constructor(config: Config);
    private connect;
    callTool(name: "web_search" | "understand_image", args: unknown): Promise<CallToolResult>;
    close(): Promise<void>;
}
