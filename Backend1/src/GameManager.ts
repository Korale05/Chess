
import { WebSocket } from "ws";

import { INIT_GAME, MOVE } from "./message.js";
import { Game } from "./Game.js";

export class GameManager{
    private games : Game[];
    private pendingUser : WebSocket | null;
    private users : WebSocket[];

    constructor(){
        this.games =[];
        this.users = [];
        this.pendingUser = null;
    }
    
    addUser(socket : WebSocket){
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket : WebSocket){
        this.users = this.users.filter(userSocket => userSocket != socket);
        //It remove the users from the list
    }

    private addHandler(socket : WebSocket){
        socket.on("message",(data)=>{
            const messageParsed = JSON.parse(data.toString());
            if(messageParsed.type == INIT_GAME){
                if(this.pendingUser){
                    //Start the game
                    const game = new Game(this.pendingUser,socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }else{
                    this.pendingUser = socket;
                }
            }
            if(messageParsed.type == MOVE){
                const game = this.games.find(game=> game.player1 == socket || game.player2 == socket);
                if(game){
                    //make move 
                    game.makeMove(socket,messageParsed.move);
                }
            }
        })
    }
}