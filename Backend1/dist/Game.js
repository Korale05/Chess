import { Chess, Move } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./message.js";
import { prisma } from "./db.js";
import { randomUUID } from 'crypto';
import { throws } from "assert";
export class Game {
    player1;
    player2;
    board;
    moves;
    startTime;
    moveCount;
    gameId;
    constructor(player1, player2, gameId) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date;
        this.moveCount = 0;
        this.gameId = null;
    }
    async createGameHandler() {
        try {
            await this.createGameInDb();
        }
        catch (error) {
            console.log(error);
            return;
        }
        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: [this.player1.id, this.player2.id]
                }
            }
        });
        if (this.player1)
            this.player1.socket.send(JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "white",
                    whiltePlayer: users.find(user => user.id == this.player1.id)?.username,
                    BlackPlayer: users.find(user => user.id == this.player2.id)?.username,
                }
            }));
        if (this.player2)
            this.player2.socket.send(JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "Black",
                    whiltePlayer: users.find(user => user.id == this.player1.id)?.username,
                    BlackPlayer: users.find(user => user.id == this.player2.id)?.username,
                }
            }));
    }
    async createGameInDb() {
        const game = await prisma.game.create({
            data: {
                status: 'WAITING',
                currentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                whitePlayer: {
                    connect: {
                        id: this.player1.id,
                    },
                },
                blackPlayer: {
                    connect: {
                        id: this.player2.id,
                    },
                },
            },
        });
        this.gameId = game.id;
    }
    async handleDisconnect(id) {
        const winner = this.player1.id == id ? "BLACK" : "WHITE";
        try {
            await prisma.game.update({
                where: { id: this.gameId },
                data: {
                    status: "FINISHED",
                    winner: winner,
                    endedAt: new Date()
                }
            });
        }
        catch (error) {
            console.log(error);
            return;
        }
        const opponent = this.player1.id == id ? this.player2 : this.player1;
        opponent?.socket?.send(JSON.stringify({
            tyep: GAME_OVER,
            payload: {
                reason: "OPPONENT_DISCONNECTED",
                winner: winner
            }
        }));
    }
    async makeMove(socket, move) {
        try {
            //make move
            if (this.board.turn() == "w") {
                if (socket != this.player1.socket)
                    return;
            }
            else {
                if (socket != this.player2.socket)
                    return;
            }
            // Position before the move
            const before = this.board.fen();
            // Make The Move
            const result = this.board.move(move);
            this.moveCount++;
            // Position after the move 
            const after = this.board.fen();
            // Save Move in DB
            await prisma.move.create({
                data: {
                    gameId: this.gameId,
                    moveNumber: this.moveCount,
                    from: move.from,
                    to: move.to,
                    before: before,
                    after: after,
                    timeTaken: 0,
                    san: result.san
                }
            });
        }
        catch (error) {
            console.log(error);
            return;
        }
        // Check mate after the move 
        if (this.board.isCheckmate()) {
            const winner = this.board.turn() == "w" ? "BLACK" : "WHITE";
            console.log(this.gameId);
            const responce = await prisma.game.update({
                where: {
                    id: this.gameId
                },
                data: {
                    status: "FINISHED",
                    winner: winner
                }
            });
            console.log("Update the game Status !");
        }
        // Sending both move to the both Player 
        this.player2.socket.send(JSON.stringify({
            type: MOVE,
            payload: move,
        }));
        this.player1.socket.send(JSON.stringify({
            type: MOVE,
            payload: move,
        }));
    }
}
//# sourceMappingURL=Game.js.map