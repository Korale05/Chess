
import { WebSocket } from "ws";

import { INIT_GAME, MOVE } from "./message.js";
import { Game, type player } from "./Game.js";

import type { GAME_STATUS } from "./Game.js";

export class GameManager{
    private games : Game[];
    private pendingUser : player | null;
    private users : player[];

    constructor(){
        this.games =[];
        this.users = [];
        this.pendingUser = null;
    }
    
    addUser({ id , socket }: player){
        this.users.push({id,socket});
        this.addHandler({id , socket});
        console.log("User is Added !");
    }

    
    removeUser(ws: WebSocket) {
        const entry = this.users.find(u => u.socket === ws);
        if (!entry) return;

        const game = this.games.find(
            g => g.player1.socket === ws || g.player2?.socket === ws  // match the actual connection
        );

        if (game) {
            game.handleDisconnect(entry.id);
            this.games = this.games.filter(g => g !== game);
        }

        
        this.users = this.users.filter(u => u.socket !== ws);
    }

    

    private addHandler({ id , socket } : player ){
        socket.on("message",async (data : WebSocket.RawData)=>{
            const messageParsed = JSON.parse(data.toString());
            if(messageParsed.type == INIT_GAME){
                if(this.pendingUser){
                    if(this.pendingUser.socket == socket)return;
                    //Start the game
                    const game = new Game(this.pendingUser,{socket ,id ,color: "b"});
                    await game.createGameHandler();
                    this.games.push(game);
                    this.pendingUser = null;
                }else{
                    this.pendingUser = { id , socket ,color : "w"};
                }
            }
            if(messageParsed.type == MOVE){
                const game = this.games.find(game=> game.player1?.socket == socket || game.player2?.socket == socket);
                if(game){
                    //make move 
                    game.makeMove(socket,messageParsed.move);
                }
            }
        })
    }
}