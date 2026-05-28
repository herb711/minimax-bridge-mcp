export declare function getAgentManifest(): {
    schemaVersion: string;
    id: string;
    name: string;
    displayName: string;
    version: string;
    description: string;
    transport: {
        type: string;
        command: string;
        args: string[];
        env: {
            MINIMAX_API_KEY: {
                required: boolean;
                secret: boolean;
                description: string;
            };
            MINIMAX_API_HOST: {
                required: boolean;
                default: string;
            };
            MINIMAX_MCP_BASE_PATH: {
                required: boolean;
                default: string;
            };
            MINIMAX_T2A_MODE: {
                required: boolean;
                default: string;
                enum: string[];
            };
            MINIMAX_ENABLE_TOKEN_PLAN_PROXY: {
                required: boolean;
                default: string;
                enum: string[];
            };
            MINIMAX_PLAN_API_KEY: {
                required: boolean;
                secret: boolean;
                description: string;
            };
            MINIMAX_PLAN_MCP_COMMAND: {
                required: boolean;
                default: string;
            };
            MINIMAX_PLAN_MCP_ARGS: {
                required: boolean;
                default: string;
            };
        };
    };
    lifecycle: {
        managedByAgent: boolean;
        startOnDemand: boolean;
        restartOnCrash: boolean;
        shutdownWithAgent: boolean;
    };
    capabilities: {
        tools: {
            name: string;
            description: string | undefined;
            inputSchema: {
                [x: string]: unknown;
                type: "object";
                properties?: {
                    [x: string]: object;
                } | undefined;
                required?: string[] | undefined;
            };
        }[];
        artifacts: string[];
        providers: string[];
    };
    security: {
        permissions: string[];
        notes: string[];
    };
    links: {
        docs: string;
        examples: string;
    };
};
