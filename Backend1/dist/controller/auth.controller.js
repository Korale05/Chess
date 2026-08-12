import { Prisma } from "../generated/prisma/browser.js";
import { ApiError } from "../utils/apiError.js";
import { prisma } from "../db.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { use } from "react";
export async function singup(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.json(new ApiError(404, "Username, email and password are required"));
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
        if (existingUser) {
            return res.json(new ApiResponse(201, "Username or email already exists"));
        }
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash
            },
            select: {
                id: true,
                username: true,
                email: true,
                passwordHash: false
            }
        });
        return res.json(new ApiResponse(201, user, "User Created Successfully !"));
    }
    catch (error) {
        return res.json(new ApiError(401, "Singup Failded !"));
    }
}
export async function singin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json(new ApiError(401, "Email or Password is Missing !"));
        }
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return res.json(new ApiError(401, "Invalid Email or Password !"));
        }
        const validPassword = await comparePassword(password, user.passwordHash);
        if (!validPassword) {
            return res.json(new ApiError(401, "Password is Wrong !"));
        }
        const accessToekn = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        res.cookie("accessToken", accessToekn, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, // 15 min
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const reqUserInfo = {
            id: user.id,
            username: user.username,
            eamil: user.email
        };
        return res.json(new ApiResponse(201, reqUserInfo, "Signin Successfully !"));
    }
    catch (error) {
        return res.json(new ApiError(401, "Internal Server Error!"));
    }
}
export async function refreshAccessToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.json(new ApiError(401, "RefreshToken is Missing !"));
        }
        const decoded = verifyRefreshToken(refreshToken);
        const accessToken = generateAccessToken(decoded.userId);
        const NewrefreshToken = generateRefreshToken(decoded.userId);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Access token refreshed",
        });
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token",
        });
    }
}
export async function logout(req, res) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json(new ApiResponse(201, "Logout Successfully !"));
}
export async function me(req, res) {
    try {
        if (!req.userId) {
            return res.json(new ApiError(401, "Unauthroized!"));
        }
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.json(new ApiError(401, "User not found !"));
        }
        return res.status(200).json(new ApiResponse(201, user));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
//# sourceMappingURL=auth.controller.js.map