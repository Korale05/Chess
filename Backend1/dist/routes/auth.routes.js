import { Router } from "express";
import { singup, singin, refreshAccessToken, logout, me, } from "../controller/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
const router = Router();
router.post("/signup", singup);
router.post("/signin", singin);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.post("/me", authMiddleware, me);
export default router;
//# sourceMappingURL=auth.routes.js.map