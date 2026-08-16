import { Chess } from "chess.js";
import { ChessBoard } from "../components/ChessBoard.tsx";
import { useSocket } from "../hooks/useSocket.tsx";
import { useEffect, useRef, useState } from "react";
import { PlayStartEndSound } from "../utils/startSound.ts";
import { playMoveSound } from "../utils/sound.ts";
import confetti from "canvas-confetti";


// Message 
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";


export function Game() {
    const socket = useSocket();
    const chessRef = useRef(new Chess());
    const [board, setBoard] = useState(chessRef.current.board());
    const [started, setStarted] = useState(false);
    const [user ,setUser] = useState<string | null>(null);
    const [opponent ,setOpponent] = useState<string | null>(null);
    const [ischeck , setCheck] = useState<Boolean>(false);
    const [moves , setMove] = useState<String[]>([]);
    const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);

    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data.toString());

            switch (message.type) {
                case INIT_GAME:
                    chessRef.current = new Chess();
                    setBoard(chessRef.current.board());
                    setStarted(true);
                    PlayStartEndSound(true);
                    console.log(message.payload.whiltePlayer);
                    setUser(message.payload.whiltePlayer);
                    console.log(message.type.BlackPlayer);
                    setOpponent(message.payload.BlackPlayer)
                    setPlayerColor(message.payload.color === "white" ? "w" : "b");
                    break;
                case MOVE:
                    const moveResult = chessRef.current.move(message.payload);
                    setBoard(chessRef.current.board());
                    playMoveSound(moveResult,chessRef.current?.isCheck());
                    setMove(prev=> [... prev,moveResult.san]);
                    console.log(moves);
                    break;
                case GAME_OVER:
                    setCheck(true); // reuse your existing checkmate-modal state, or make a new one
                    console.log(message.payload.reason, message.payload.winner);
                    break;
            }
        };
    }, [socket]);

    useEffect(()=>{
        //check if game over or not
        if(chessRef?.current.isCheckmate()){
            setCheck(true);
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 },
            });
            setTimeout(() => {
                confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 } });
                confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 } });
            }, 300);
        }
    },[board,Chess])
    const winner = chessRef.current.turn() == "w" ? opponent : user;
    if (!socket) return <div>Connecting....</div>;
    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-900 relative">
            
            <div className="flex gap-8">
                {ischeck && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <div className="bg-slate-800 border border-slate-600 rounded-2xl px-10 py-8 text-center shadow-2xl">
                                <div className="text-5xl mb-3">👑</div>
                                <h2 className="text-2xl font-bold text-white mb-1">{winner} Wins!</h2>
                                <p className="text-slate-400 text-sm">by Checkmate</p>
                            </div>
                        </div>
                    )}
                <div className="flex flex-col gap-3">
                    {/* Top player (opponent) */}
                    {
                        opponent && (
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/avatar.svg"
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full bg-slate-600 object-cover"
                                    />
                                    <span className="text-white font-semibold">{opponent}</span>
                                </div>
                                <span className="text-slate-400 text-sm">10:00</span>
                            </div>
                        )
                    }

                    <div className="w-fit">
                        <ChessBoard socket={socket} board={board} chess={chessRef.current}  playerColor={playerColor}/>
                    </div>

                    {/* Bottom player (you) */}
                    {
                        user && (
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="/avatar.svg"
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full bg-slate-600 object-cover"
                                    />
                                    <span className="text-white font-semibold">{user}</span>
                                </div>
                                <span className="text-slate-400 text-sm">10:00</span>
                            </div>
                        )
                    }
                </div>

                {/* Game Controls */}
                <div className="w-64 bg-slate-700 p-4 rounded">
                    {!started && (
                        <button
                            onClick={() => socket.send(JSON.stringify({ type: INIT_GAME }))}
                            className="rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
                        >
                            Play
                        </button>
                    )}
                    {/* Show Moves to Player */}
                    {
                        <div className="mt-1 text-white">
                            {Array.from(
                                { length: Math.ceil(moves.length / 2) },
                                (_, index) => {
                                    const whiteMove = moves[index * 2];
                                    const blackMove = moves[index * 2 + 1];

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center py-2 border-b border-slate-600"
                                        >
                                            {/* Move number */}
                                            <span className="w-8 text-slate-400">
                                                {index + 1}.
                                            </span>

                                            {/* White move */}
                                            <span className="w-20 font-semibold">
                                                {whiteMove}
                                            </span>

                                            {/* Black move */}
                                            <span className="w-1 font-semibold">
                                                {blackMove || ""}
                                            </span>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}