import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./message.js";
import { Game } from "./Game.js";
export class GameManager {
    games;
    pendingUser;
    users;
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
    addUser({ id, socket }) {
        this.users.push({ id, socket });
        this.addHandler({ id, socket });
        console.log("User is Added !");
    }
    removeUser(ws) {
        const entry = this.users.find(u => u.socket === ws);
        if (!entry)
            return;
        const game = this.games.find(g => g.player1.id === entry.id || g.player2?.id === entry.id);
        if (game) {
            game.handleDisconnect(entry.id); // this ends the game, no timer
        }
        this.users = this.users.filter(u => u.socket !== ws);
    }
    addHandler({ id, socket }) {
        socket.on("message", async (data) => {
            const messageParsed = JSON.parse(data.toString());
            if (messageParsed.type == INIT_GAME) {
                if (this.pendingUser) {
                    if (this.pendingUser.socket == socket)
                        return;
                    //Start the game
                    const game = new Game(this.pendingUser, { socket, id, color: "b" });
                    await game.createGameHandler();
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = { id, socket, color: "w" };
                }
            }
            if (messageParsed.type == MOVE) {
                const game = this.games.find(game => game.player1?.socket == socket || game.player2?.socket == socket);
                if (game) {
                    //make move 
                    game.makeMove(socket, messageParsed.move);
                }
            }
        });
    }
}
//# sourceMappingURL=GameManager.js.map