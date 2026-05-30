import path from "node:path";
import { TOOLS } from "./toolSchemas.js";
const VERSION = "0.1.6";
function installPath(installDir, ...parts) {
    if (installDir === "${installDir}")
        return ["${installDir}", ...parts].join("/");
    return path.join(installDir, ...parts);
}
export function getAgentConfig(installDir = "${installDir}") {
    return {
        schemaVersion: "redou.agent.mcp.config/v1",
        name: "MiniMax Bridge MCP",
        description: "Paste this into your agent or OpenRedou MCP settings, then enter MINIMAX_API_KEY in the agent UI.",
        mcp: {
            "minimax-bridge": {
                type: "local",
                command: ["node", installPath(installDir, "dist", "index.js")],
                enabled: true,
                environment: {
                    MINIMAX_API_HOST: "https://api.minimaxi.com",
                    MINIMAX_MCP_BASE_PATH: installPath(installDir, "outputs", "minimax"),
                    MINIMAX_T2A_MODE: "async",
                    MINIMAX_ENABLE_TOKEN_PLAN_PROXY: "false",
                },
            },
        },
        secrets: {
            MINIMAX_API_KEY: {
                required: true,
                description: "Enter this secret in your agent/OpenRedou UI after importing the MCP config.",
            },
            MINIMAX_PLAN_API_KEY: {
                required: false,
                description: "Only needed when MINIMAX_ENABLE_TOKEN_PLAN_PROXY is true.",
            },
        },
    };
}
export function getAgentManifest() {
    return {
        schemaVersion: "redou.agent.mcp.manifest/v1",
        id: "minimax-bridge-mcp",
        name: "minimax-bridge-mcp",
        displayName: "MiniMax Bridge MCP",
        version: VERSION,
        description: "A single stdio MCP server that exposes MiniMax multimodal tools to agents. It routes Token Plan tools to MiniMax Token Plan MCP and routes generation tools to MiniMax HTTP/WebSocket APIs.",
        transport: {
            type: "stdio",
            command: "node",
            args: ["${installDir}/dist/index.js"],
            env: {
                MINIMAX_API_KEY: { required: false, secret: true, description: "MiniMax API key. Configure this later in the agent/OpenRedou UI." },
                MINIMAX_API_HOST: { required: false, default: "https://api.minimaxi.com" },
                MINIMAX_MCP_BASE_PATH: { required: false, default: "${installDir}/outputs/minimax" },
                MINIMAX_T2A_MODE: { required: false, default: "async", enum: ["async", "websocket"] },
                MINIMAX_ENABLE_TOKEN_PLAN_PROXY: { required: false, default: "false", enum: ["true", "false"] },
                MINIMAX_PLAN_API_KEY: { required: false, secret: true, description: "Required only when Token Plan MCP proxy is enabled." },
                MINIMAX_PLAN_MCP_COMMAND: { required: false, default: "uvx" },
                MINIMAX_PLAN_MCP_ARGS: { required: false, default: "[\"minimax-coding-plan-mcp\", \"-y\"]" },
            },
        },
        lifecycle: {
            managedByAgent: true,
            startOnDemand: true,
            restartOnCrash: true,
            shutdownWithAgent: true,
        },
        capabilities: {
            tools: TOOLS.map((tool) => ({
                name: tool.name,
                description: tool.description,
                inputSchema: tool.inputSchema,
            })),
            artifacts: ["audio", "image", "video", "music", "json"],
            providers: ["minimax-token-plan-mcp", "minimax-http", "minimax-websocket"],
        },
        security: {
            permissions: ["network:minimax", "file:write:artifacts", "secret:read:MINIMAX_API_KEY"],
            notes: [
                "The MCP server must not print diagnostics to stdout because stdout is reserved for MCP JSON-RPC.",
                "Installers do not require API keys. Secrets should be configured in the agent/OpenRedou UI.",
                "Generated files are written under MINIMAX_MCP_BASE_PATH unless output_directory is provided per tool.",
            ],
        },
        links: {
            docs: "./docs/OPENCODE_INSTALL.md",
            examples: "./examples",
        },
    };
}
//# sourceMappingURL=manifest.js.map