declare class ApiError extends Error {
    private success;
    statuscode: number;
    private data;
    private errors;
    constructor(statusCode: number, message?: string, errors?: never[], stack?: string);
}
export { ApiError };
//# sourceMappingURL=apiError.d.ts.map