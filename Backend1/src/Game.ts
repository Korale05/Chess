import { Chess, Move } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./message.js";
import { prisma } from "./db.js";
import { randomUUID } from 'crypto';


type GAME_STATUS = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'TIME_UP' | 'PLAYER_EXIT';
type GAME_RESULT = "WHITE_WINS" | "BLACK_WINS" | "DRAW";

export interface player {
    id : number,
    socket : WebSocket
}
export class Game{
    public player1 : player;
    public player2 : player;
    private board : Chess;
    private moves : string[];
    private startTime : Date;
    private moveCount : number;
    private gameId : number | null;

    constructor(player1 : player ,player2 : player,gameId? : string){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date;
        this.moveCount = 1; 
        this.gameId = null;
    }
    async createGameHandler(){

        try{
            await this.createGameInDb();
        }catch(error){
            console.log(error);
            return;
        }

        const users = await prisma.user.findMany({
            where : {
                id : {
                    in : [this.player1.id , this.player2.id]
                }
            }
        })
        if(this.player1)
            this.player1.socket.send(JSON.stringify({
                type : INIT_GAME,
                payload : {
                    color : "white",
                    whiltePlayer : users.find(user => user.id == this.player1.id)?.username,
                    BlackPlayer : users.find(user=>user.id == this.player2.id)?.username
                }
            }));
        if(this.player2)
            this.player2.socket.send(JSON.stringify({
                type : INIT_GAME,
                payload : {
                    color : "Black",
                    whiltePlayer : users.find(user => user.id == this.player1.id)?.username,
                    BlackPlayer : users.find(user=>user.id == this.player2.id)?.username
                }
            }));
    }
    async createGameInDb(){
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
    
    makeMove(socket : WebSocket,move : {
        to : string,
        from : string
    }){

        //make move
        console.log(move);
        this.board.move(move);
        this.moveCount++;

        //check if game over or not
        if(this.board.isGameOver()){
            //Send Game Over Message to Both Player
            this.player1.socket.send(JSON.stringify({
                type : GAME_OVER,
                payload : {
                    winner : this.board.turn() == 'w' ? "black" : "white"
                }
            }));

            
            this.player2.socket.send(JSON.stringify({
                type : GAME_OVER,
                payload : {
                    winner : this.board.turn() == 'w' ? "black" : "white"
                }
            }))
            
        }

        //if Game is not Over
        // if even turn measn playr 1 is moved now your turn 
        
        
        this.player2.socket.send(JSON.stringify({
            type : MOVE,
            payload : move
        }));
        
        this.player1.socket.send(JSON.stringify({
            type : MOVE,
            payload : move
        }))
        
    }
}