import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use("/api/auth", authRoutes);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
export default app;
//# sourceMappingURL=app.js.map