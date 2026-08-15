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
        this.moveCount = 1;
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
                    BlackPlayer: users.find(user => user.id == this.player2.id)?.username
                }
            }));
        if (this.player2)
            this.player2.socket.send(JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "Black",
                    whiltePlayer: users.find(user => user.id == this.player1.id)?.username,
                    BlackPlayer: users.find(user => user.id == this.player2.id)?.username
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
    makeMove(socket, move) {
        try {
            //make move
            console.log(move);
            this.board.move(move);
            this.moveCount++;
        }
        catch (error) {
            console.log(error);
            return;
        }
        console.log("HELLO after the mvoe!");
        //if Game is not Over
        // if even turn measn playr 1 is moved now your turn 
        this.player2.socket.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
        this.player1.socket.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
    }
}
//# sourceMappingURL=Game.js.map