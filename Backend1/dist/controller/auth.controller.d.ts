import type { Response, Request } from "express";
import type { AuthRequest } from "../middlewares/auth.middlewares.js";
export declare function singup(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function singin(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function refreshAccessToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function me(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map