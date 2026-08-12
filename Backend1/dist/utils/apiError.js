class ApiError extends Error {
    success;
    statuscode;
    data;
    errors;
    constructor(statusCode, message = "Something went wrong!", errors = [], stack = "") {
        super(message);
        this.statuscode = statusCode;
        this.success = false;
        this.data = null;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };
//# sourceMappingURL=apiError.js.map