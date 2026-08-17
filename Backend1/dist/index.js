import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'; // npm i cookie @types/cookie
import { GameManager } from './GameManager.js';
import app from "./app.js";
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
const server = app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
});
const wss = new WebSocketServer({ server });
const gamemanager = new GameManager();
function getUserId(request) {
    const rawCookies = request.headers.cookie;
    console.log("WS handshake cookies present?:", !!rawCookies); // temp debug
    if (!rawCookies)
        return null;
    const parsed = cookie.parseCookie(rawCookies);
    const token = parsed.accessToken;
    console.log("accessToken cookie found?:", !!token); // temp debug
    if (!token)
        return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    }
    catch (err) {
        console.log("JWT verify failed:", err.message); // temp debug
        return null;
    }
}
wss.on('connection', function connection(socket, request) {
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
//# sourceMappingURL=index.js.map