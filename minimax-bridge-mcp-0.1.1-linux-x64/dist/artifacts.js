import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { UserInputError } from "./errors.js";
const MIME_BY_EXT = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    flac: "audio/flac",
    pcm: "audio/L16",
    mp4: "video/mp4",
    mov: "video/quicktime",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    json: "application/json",
    txt: "text/plain",
};
export function extensionFromMime(mime, fallback) {
    if (!mime)
        return fallback;
    const normalized = mime.split(";")[0]?.trim().toLowerCase();
    switch (normalized) {
        case "audio/mpeg":
        case "audio/mp3":
            return "mp3";
        case "audio/wav":
        case "audio/x-wav":
            return "wav";
        case "audio/flac":
            return "flac";
        case "video/mp4":
            return "mp4";
        case "image/jpeg":
            return "jpg";
        case "image/png":
            return "png";
        case "image/webp":
            return "webp";
        case "image/gif":
            return "gif";
        default:
            return fallback;
    }
}
export function mimeFromExt(ext) {
    return MIME_BY_EXT[ext.replace(/^\./, "").toLowerCase()] || "application/octet-stream";
}
export function safeExt(ext, fallback) {
    const raw = (ext || fallback).replace(/^\./, "").toLowerCase();
    return /^[a-z0-9]+$/.test(raw) ? raw : fallback;
}
export function safeFilePrefix(prefix, fallback) {
    const raw = (prefix || fallback).replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 60);
    return raw || fallback;
}
export class ArtifactStore {
    basePath;
    constructor(basePath) {
        this.basePath = basePath;
    }
    async ensureBasePath() {
        await fs.mkdir(this.basePath, { recursive: true });
    }
    resolveDirectory(outputDirectory, subdir) {
        const requested = typeof outputDirectory === "string" && outputDirectory.trim()
            ? outputDirectory.trim()
            : path.join(this.basePath, subdir);
        return path.resolve(requested);
    }
    makeName(prefix, ext) {
        const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
        const nonce = crypto.randomBytes(4).toString("hex");
        return `${prefix}_${stamp}_${nonce}.${safeExt(ext, "bin")}`;
    }
    async writeBuffer(options) {
        const ext = safeExt(options.ext, extensionFromMime(options.mime, "bin"));
        const dir = this.resolveDirectory(options.outputDirectory, options.subdir);
        await fs.mkdir(dir, { recursive: true });
        const fileName = this.makeName(safeFilePrefix(options.prefix, options.subdir), ext);
        const filePath = path.join(dir, fileName);
        const buffer = Buffer.isBuffer(options.data) ? options.data : Buffer.from(options.data);
        await fs.writeFile(filePath, buffer);
        return {
            path: filePath,
            mime: options.mime || mimeFromExt(ext),
            size_bytes: buffer.byteLength,
            url: options.url,
        };
    }
    async writeJson(options) {
        const buffer = Buffer.from(JSON.stringify(options.data, null, 2), "utf8");
        return this.writeBuffer({
            data: buffer,
            subdir: options.subdir,
            outputDirectory: options.outputDirectory,
            prefix: options.prefix,
            ext: "json",
            mime: "application/json",
        });
    }
    async writeBase64(options) {
        const cleaned = options.base64.includes(",") ? options.base64.split(",").pop() || "" : options.base64;
        if (!cleaned)
            throw new UserInputError("Empty base64 payload");
        return this.writeBuffer({
            data: Buffer.from(cleaned, "base64"),
            subdir: options.subdir,
            outputDirectory: options.outputDirectory,
            prefix: options.prefix,
            ext: options.ext,
            mime: options.mime,
        });
    }
}
//# sourceMappingURL=artifacts.js.map