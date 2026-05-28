export interface Artifact {
    path: string;
    mime: string;
    size_bytes: number;
    url?: string;
}
export declare function extensionFromMime(mime: string | null | undefined, fallback: string): string;
export declare function mimeFromExt(ext: string): string;
export declare function safeExt(ext: string | undefined, fallback: string): string;
export declare function safeFilePrefix(prefix: string | undefined, fallback: string): string;
export declare class ArtifactStore {
    readonly basePath: string;
    constructor(basePath: string);
    ensureBasePath(): Promise<void>;
    resolveDirectory(outputDirectory: unknown, subdir: string): string;
    private makeName;
    writeBuffer(options: {
        data: Buffer | Uint8Array;
        subdir: string;
        outputDirectory?: unknown;
        prefix?: string;
        ext?: string;
        mime?: string;
        url?: string;
    }): Promise<Artifact>;
    writeJson(options: {
        data: unknown;
        subdir: string;
        outputDirectory?: unknown;
        prefix?: string;
    }): Promise<Artifact>;
    writeBase64(options: {
        base64: string;
        subdir: string;
        outputDirectory?: unknown;
        prefix?: string;
        ext?: string;
        mime?: string;
    }): Promise<Artifact>;
}
