import { Chess } from "chess.js";
import { ChessBoard } from "../components/ChessBoard.tsx";
import { useSocket } from "../hooks/useSocket.tsx";
import { useEffect, useRef, useState } from "react";

// Message 
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";


export function Game() {
    const socket = useSocket();
    const chessRef = useRef(new Chess());
    const [board, setBoard] = useState(chessRef.current.board());
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data.toString());

            switch (message.type) {
                case INIT_GAME:
                    chessRef.current = new Chess();
                    setBoard(chessRef.current.board());
                    setStarted(true);
                    break;
                case MOVE:
                    chessRef.current.move(message.payload);
                    setBoard(chessRef.current.board());
                    break;
                case GAME_OVER:
                    break;
            }
        };
    }, [socket]);

    if (!socket) return <div>Connecting....</div>;
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-screen-lg pt-8">
                <div className="flex w-full gap-8">
                    <div className="w-fit bg-red-200">
                        <ChessBoard socket={socket} board={board} chess={chessRef.current} />
                    </div>
                    <div className="w-64 bg-slate-700 p-4">
                        {!started && (
                            <button
                                onClick={() => socket.send(JSON.stringify({ type: INIT_GAME }))}
                                className="rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
                            >
                                Play
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}