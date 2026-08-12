import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager.js';
import app from "./app.js";
const PORT = process.env.PORT || 3000;
// HTTP server
app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
});
// WebSocket Server
const wss = new WebSocketServer({ port: 8080 });
const gamemanager = new GameManager();
wss.on('connection', function connection(ws) {
    gamemanager.addUser(ws);
    wss.on("close", () => {
        gamemanager.removeUser(ws);
    });
});
console.log("WebSocker srver Runnign on Port : ", 8080);
//# sourceMappingURL=index.js.map