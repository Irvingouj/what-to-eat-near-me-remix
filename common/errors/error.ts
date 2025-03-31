

export class HttpError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
    }
}

export class EatError extends HttpError {
    private userFriendlyMessage: string | undefined;
    constructor(message: string, statusCode: number) {
        super(JSON.stringify(message), statusCode);
    }

    withUserFriendlyMessage(message: string) {
        this.userFriendlyMessage = message;
        return this;
    }
}

