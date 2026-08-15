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
        this.users.push(socket);
        this.addHandler({ id, socket });
        console.log("User is Added !");
    }
    removeUser(socket) {
        this.users = this.users.filter(userSocket => userSocket != socket);
        //It remove the users from the list
    }
    addHandler({ id, socket }) {
        socket.on("message", async (data) => {
            const messageParsed = JSON.parse(data.toString());
            if (messageParsed.type == INIT_GAME) {
                if (this.pendingUser) {
                    //Start the game
                    const game = new Game(this.pendingUser, { socket, id });
                    await game.createGameHandler();
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = { id, socket };
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