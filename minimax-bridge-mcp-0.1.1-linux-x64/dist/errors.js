export class UserInputError extends Error {
    code = "USER_INPUT_ERROR";
}
export class MiniMaxApiError extends Error {
    code = "MINIMAX_API_ERROR";
    status;
    responseBody;
    constructor(message, options = {}) {
        super(message);
        this.status = options.status;
        this.responseBody = options.responseBody;
    }
}
export function errorToJson(error) {
    if (error instanceof MiniMaxApiError) {
        return {
            ok: false,
            code: error.code,
            message: error.message,
            status: error.status,
            responseBody: error.responseBody,
        };
    }
    if (error instanceof UserInputError) {
        return { ok: false, code: error.code, message: error.message };
    }
    if (error instanceof Error) {
        return { ok: false, code: "ERROR", message: error.message, stack: process.env.NODE_ENV === "development" ? error.stack : undefined };
    }
    return { ok: false, code: "UNKNOWN_ERROR", message: String(error) };
}
//# sourceMappingURL=errors.js.map