import path from "node:path";
function numberFromEnv(name, fallback) {
    const value = process.env[name];
    if (!value)
        return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function boolFromEnv(name, fallback) {
    const value = process.env[name];
    if (value == null || value === "")
        return fallback;
    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}
function parseArgs(value, fallback) {
    if (!value || !value.trim())
        return fallback;
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string"))
                return parsed;
        }
        catch {
            // fall through to shell-like split
        }
    }
    return trimmed.split(/\s+/g).filter(Boolean);
}
function normalizeHost(host) {
    return host.replace(/\/+$/g, "");
}
export function loadConfig() {
    const apiHost = normalizeHost(process.env.MINIMAX_API_HOST || "https://api.minimaxi.com");
    const basePath = path.resolve(process.env.MINIMAX_MCP_BASE_PATH || process.env.MINIMAX_BASE_PATH || "./outputs/minimax");
    const resourceModeRaw = (process.env.MINIMAX_RESOURCE_MODE ||
        process.env.MINIMAX_API_RESOURCE_MODE ||
        "local").toLowerCase();
    const t2aModeRaw = (process.env.MINIMAX_T2A_MODE || "async").toLowerCase();
    return {
        apiKey: process.env.MINIMAX_API_KEY || "",
        apiHost,
        basePath,
        resourceMode: resourceModeRaw === "url" ? "url" : "local",
        defaultPollIntervalSeconds: numberFromEnv("MINIMAX_POLL_INTERVAL_SECONDS", 10),
        defaultMaxWaitSeconds: numberFromEnv("MINIMAX_MAX_WAIT_SECONDS", 600),
        t2aMode: t2aModeRaw === "websocket" ? "websocket" : "async",
        enableTokenPlanProxy: boolFromEnv("MINIMAX_ENABLE_TOKEN_PLAN_PROXY", false),
        tokenPlanApiKey: process.env.MINIMAX_PLAN_API_KEY || process.env.MINIMAX_API_KEY || "",
        tokenPlanCommand: process.env.MINIMAX_PLAN_MCP_COMMAND || "uvx",
        tokenPlanArgs: parseArgs(process.env.MINIMAX_PLAN_MCP_ARGS, ["minimax-coding-plan-mcp", "-y"]),
    };
}
//# sourceMappingURL=config.js.map