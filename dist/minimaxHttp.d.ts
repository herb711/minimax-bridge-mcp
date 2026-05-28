import { ArtifactStore, type Artifact } from "./artifacts.js";
import type { Config } from "./config.js";
export declare class MiniMaxHttpClient {
    private readonly config;
    private readonly store;
    constructor(config: Config, store: ArtifactStore);
    private api;
    private requireApiKey;
    private authHeaders;
    private jsonRequest;
    private bytesRequest;
    uploadFile(fileOrUrl: string, purpose: string, isUrl: boolean): Promise<{
        file_id: string;
        raw: unknown;
        tempFile?: string;
    }>;
    private downloadUrlAsArtifact;
    private statusOf;
    private fileIdOf;
    private taskIdOf;
    private poll;
    listVoices(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        voice_type: string;
        voices: import("./systemVoices.js").VoiceInfo[];
        count: number;
        note: string;
    }>;
    textToAudio(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        artifact: Artifact;
    } | {
        ok: boolean;
        backend: string;
        tool: string;
        async: boolean;
        task_id: string;
        raw: unknown;
        result?: undefined;
    } | {
        ok: boolean;
        backend: string;
        tool: string;
        async: boolean;
        task_id: string;
        result: {
            ok: boolean;
            backend: string;
            tool: string;
            task_id: string;
            status: unknown;
            file_id: string;
            artifact: Artifact;
            raw: unknown;
        } | {
            ok: boolean;
            backend: string;
            tool: string;
            task_id: string;
            status: unknown;
            file_id: string | undefined;
            raw: unknown;
            artifact?: undefined;
        };
        raw?: undefined;
    }>;
    private textToAudioAsyncHttp;
    private textToAudioWebSocket;
    queryTextToAudio(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        task_id: string;
        status: unknown;
        file_id: string;
        artifact: Artifact;
        raw: unknown;
    } | {
        ok: boolean;
        backend: string;
        tool: string;
        task_id: string;
        status: unknown;
        file_id: string | undefined;
        raw: unknown;
        artifact?: undefined;
    }>;
    voiceClone(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        voice_id: string;
        file_id: string;
        prompt_file_id: string | undefined;
        artifacts: Artifact[];
        raw: unknown;
        upload_raw: unknown;
        prompt_upload_raw: unknown;
    }>;
    textToImage(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        artifacts: Artifact[];
        raw: unknown;
    }>;
    generateVideo(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        async: boolean;
        task_id: string;
        raw: unknown;
        result?: undefined;
    } | {
        ok: boolean;
        backend: string;
        tool: string;
        async: boolean;
        task_id: string;
        result: {
            ok: boolean;
            backend: string;
            tool: string;
            task_id: string;
            status: unknown;
            file_id: string;
            download_url: string | undefined;
            artifact: Artifact | undefined;
            raw: unknown;
            retrieve_raw: unknown;
        } | {
            ok: boolean;
            backend: string;
            tool: string;
            task_id: string;
            status: unknown;
            raw: unknown;
            file_id?: undefined;
            download_url?: undefined;
            artifact?: undefined;
            retrieve_raw?: undefined;
        };
        raw: unknown;
    }>;
    queryVideoGeneration(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        task_id: string;
        status: unknown;
        file_id: string;
        download_url: string | undefined;
        artifact: Artifact | undefined;
        raw: unknown;
        retrieve_raw: unknown;
    } | {
        ok: boolean;
        backend: string;
        tool: string;
        task_id: string;
        status: unknown;
        raw: unknown;
        file_id?: undefined;
        download_url?: undefined;
        artifact?: undefined;
        retrieve_raw?: undefined;
    }>;
    videoTemplateGeneration(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        async: boolean;
        task_id: string;
        raw: unknown;
        result?: undefined;
    } | {
        ok: boolean;
        backend: string;
        tool: string;
        async: boolean;
        task_id: string;
        result: {
            ok: boolean;
            backend: string;
            tool: string;
            task_id: string;
            status: unknown;
            video_url: string | undefined;
            artifact: Artifact | undefined;
            raw: unknown;
        };
        raw: unknown;
    }>;
    queryVideoTemplateGeneration(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        task_id: string;
        status: unknown;
        video_url: string | undefined;
        artifact: Artifact | undefined;
        raw: unknown;
    }>;
    lyricsGeneration(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        raw: unknown;
    }>;
    musicGeneration(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        artifacts: Artifact[];
        raw: unknown;
    }>;
    musicCoverPreprocess(args: unknown): Promise<{
        ok: boolean;
        backend: string;
        tool: string;
        raw: unknown;
    }>;
}
