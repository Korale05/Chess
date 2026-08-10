import { Chess, Move } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./message.js";
export class Game {
    player1;
    player2;
    board;
    moves;
    startTime;
    moveCount;
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date;
        this.moveCount = 1;
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "Black"
            }
        }));
    }
    makeMove(socket, move) {
        //make move
        console.log(move);
        this.board.move(move);
        this.moveCount++;
        //check if game over or not
        if (this.board.isGameOver()) {
            //Send Game Over Message to Both Player
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() == 'w' ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() == 'w' ? "black" : "white"
                }
            }));
        }
        //if Game is not Over
        // if even turn measn playr 1 is moved now your turn 
        this.player2.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
        this.player1.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
    }
}
//# sourceMappingURL=Game.js.map