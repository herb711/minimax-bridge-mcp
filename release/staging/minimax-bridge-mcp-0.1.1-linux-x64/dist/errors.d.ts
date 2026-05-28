export declare class UserInputError extends Error {
    readonly code = "USER_INPUT_ERROR";
}
export declare class MiniMaxApiError extends Error {
    readonly code = "MINIMAX_API_ERROR";
    readonly status?: number;
    readonly responseBody?: unknown;
    constructor(message: string, options?: {
        status?: number;
        responseBody?: unknown;
    });
}
export declare function errorToJson(error: unknown): {
    ok: boolean;
    code: string;
    message: string;
    status: number | undefined;
    responseBody: unknown;
    stack?: undefined;
} | {
    ok: boolean;
    code: string;
    message: string;
    status?: undefined;
    responseBody?: undefined;
    stack?: undefined;
} | {
    ok: boolean;
    code: string;
    message: string;
    stack: string | undefined;
    status?: undefined;
    responseBody?: undefined;
};
