import { Chess } from "chess.js";
import { ChessBoard } from "../components/ChessBoard.tsx";
import { useSocket } from "../hooks/useSocket.tsx";
import { useEffect, useState } from "react";

// Message 
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";


export function Game (){
    const socket = useSocket();
    const [chess , setChess] = useState(new Chess());
    const [board , setBoard] = useState(chess.board());

    useEffect(()=>{
        if(!socket){
            return;
        }
        socket.onmessage = (event) =>{
            const message = JSON.parse(event.data.toString());
            console.log(message);
            
            switch(message.type){
                case INIT_GAME : 
                    setChess(new Chess());
                    setBoard(chess.board());
                    console.log("Game initialized !");
                    break;
                case MOVE : 
                    const move = message.move;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move made !");
                    break;
                case GAME_OVER : 
                    console.log("Game Over !");
                    break;
            }
        }
    },[socket])

    if(!socket) return <div>Connecting....</div>
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-screen-lg pt-8">
                <div className="flex w-full gap-8">
                    {/* Chess Board */}
                    <div className="w-fit bg-red-200">
                        <ChessBoard socket = {socket} board={board} />
                    </div>
                    {/* Game Controls */}
                    <div className="w-64 bg-slate-700 p-4">
                        <button
                            onClick={() => {
                                console.log("Sending Backend Init Request !");
                                socket.send(
                                    JSON.stringify({
                                        type: INIT_GAME,
                                    })
                                );
                            }}
                            className="rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
                        >
                            Play
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}