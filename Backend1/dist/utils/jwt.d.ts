export declare function generateAccessToken(userId: number): string;
export declare function generateRefreshToken(userId: number): string;
export declare function verifyAccessToken(token: string): {
    userId: number;
};
export declare function verifyRefreshToken(token: string): {
    userId: number;
};
//# sourceMappingURL=jwt.d.ts.map