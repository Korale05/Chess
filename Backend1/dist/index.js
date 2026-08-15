import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie'; // npm i cookie @types/cookie
import { GameManager } from './GameManager.js';
import app from "./app.js";
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
console.log(JWT_SECRET);
app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
});
const wss = new WebSocketServer({ port: 8080 });
const gamemanager = new GameManager();
function getUserId(request) {
    const rawCookies = request.headers.cookie;
    console.log("Raw cookie header on WS handshake:", rawCookies); // <-- add this
    if (!rawCookies)
        return null;
    const parsed = cookie.parseCookie(rawCookies);
    const token = parsed.accessToken;
    console.log("Token :", token);
    if (!token)
        return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("HELLO");
        console.log(decoded);
        console.log(decoded.userId);
        return decoded.userId;
    }
    catch (err) {
        return null; // invalid/expired token
    }
}
wss.on('connection', function connection(socket, request) {
    const userId = getUserId(request);
    if (!userId) {
        socket.close(4001, "Unauthorized"); // custom close code, reject the connection
        console.log("Unauthorized!");
        return;
    }
    console.log("Added to user!");
    gamemanager.addUser({ id: userId, socket });
    socket.on("close", () => {
        gamemanager.removeUser(socket);
    });
});
console.log("WebSocket server running on port:", 8080);
//# sourceMappingURL=index.js.map