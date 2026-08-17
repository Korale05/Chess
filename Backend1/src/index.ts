import { WebSocketServer, WebSocket } from 'ws';
import type { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'; // npm i cookie @types/cookie
import { GameManager } from './GameManager.js';
import app from "./app.js";

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_ACCESS_SECRET!;


const server = app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });
const gamemanager = new GameManager();

function getUserId(request: IncomingMessage): number | null {
    const rawCookies = request.headers.cookie;
    if (!rawCookies) return null;

    const parsed = cookie.parseCookie(rawCookies);
    const token = parsed.accessToken;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        return decoded.userId;
    } catch (err) {
        return null; // invalid/expired token
    }
}

wss.on('connection', function connection(socket: WebSocket, request: IncomingMessage) {
    const userId = getUserId(request);

    if (!userId) {
        socket.close(4001, "Unauthorized");
        return;
    }

    gamemanager.addUser({ id: userId, socket });

    socket.on("close", () => {
        gamemanager.removeUser(socket);
    });
});

console.log(`WebSocket server attached to port: ${PORT}`);