#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { ArtifactStore } from "./artifacts.js";
import { loadConfig } from "./config.js";
import { errorToJson } from "./errors.js";
import { MiniMaxHttpClient } from "./minimaxHttp.js";
import { TokenPlanProxy } from "./tokenPlanProxy.js";
import { TOOLS } from "./toolSchemas.js";
import { getAgentConfig, getAgentManifest } from "./manifest.js";
const VERSION = "0.1.6";
const installDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (process.argv.includes("--manifest")) {
    console.log(JSON.stringify(getAgentManifest(), null, 2));
    process.exit(0);
}
if (process.argv.includes("--agent-config")) {
    console.log(JSON.stringify(getAgentConfig(installDir), null, 2));
    process.exit(0);
}
if (process.argv.includes("--tools")) {
    console.log(JSON.stringify({ tools: TOOLS }, null, 2));
    process.exit(0);
}
const config = loadConfig();
const store = new ArtifactStore(config.basePath);
const minimax = new MiniMaxHttpClient(config, store);
const tokenPlan = new TokenPlanProxy(config);
const server = new Server({ name: "minimax-bridge-mcp", version: VERSION }, { capabilities: { tools: {} } });
function asJsonContent(value, isError = false) {
    return {
        isError,
        content: [
            {
                type: "text",
                text: JSON.stringify(value, null, 2),
            },
        ],
    };
}
async function dispatchTool(name, args) {
    switch (name) {
        // Token Plan branch. These two tools are proxied to MiniMax's Token Plan MCP.
        case "web_search":
            return tokenPlan.callTool("web_search", args);
        case "understand_image":
            return tokenPlan.callTool("understand_image", args);
        // HTTP/WebSocket branch. These tools call MiniMax public APIs directly.
        case "text_to_audio":
            return minimax.textToAudio(args);
        case "query_text_to_audio":
            return minimax.queryTextToAudio(args);
        case "list_voices":
            return minimax.listVoices(args);
        case "voice_clone":
            return minimax.voiceClone(args);
        case "text_to_image":
            return minimax.textToImage(args);
        case "generate_video":
            return minimax.generateVideo(args);
        case "image_to_video":
            return minimax.generateVideo(args);
        case "query_video_generation":
            return minimax.queryVideoGeneration(args);
        case "video_template_generation":
            return minimax.videoTemplateGeneration(args);
        case "query_video_template_generation":
            return minimax.queryVideoTemplateGeneration(args);
        case "lyrics_generation":
            return minimax.lyricsGeneration(args);
        case "music_generation":
            return minimax.musicGeneration(args);
        case "music_cover_preprocess":
            return minimax.musicCoverPreprocess(args);
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const result = await dispatchTool(request.params.name, request.params.arguments ?? {});
        // If a proxied child MCP already returned a valid MCP CallToolResult, pass it through.
        if (result && typeof result === "object" && "content" in result) {
            return result;
        }
        return asJsonContent(result);
    }
    catch (error) {
        return asJsonContent(errorToJson(error), true);
    }
});
async function main() {
    await store.ensureBasePath();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
process.on("SIGINT", async () => {
    await tokenPlan.close().catch(() => undefined);
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await tokenPlan.close().catch(() => undefined);
    process.exit(0);
});
main().catch((error) => {
    // Never write MCP diagnostics to stdout; stdio transport reserves stdout for JSON-RPC.
    console.error("minimax-bridge-mcp failed to start", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map