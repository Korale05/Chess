import type { Request, Response , NextFunction } from "express";

import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.js";
import { ApiError } from "../utils/apiError.js";

export interface AuthRequest extends Request{
    userId ? : number
}

export function authMiddleware(
    req : AuthRequest,
    res : Response,
    next : NextFunction
){
    try{
        const accessToekn = req.cookies.accessToekn;
        
        if(!accessToekn){
            return res.json(
                new ApiError(401,"Access TOken is Missing 1")
            )
        }

        const decode = verifyAccessToken(accessToekn);
        req.userId = decode.userId;

        next();
    }catch(error){
        return res.json(
            new ApiError(401,"Invalid or expired AccessToken!")
        )
    }
}