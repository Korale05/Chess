import { type Color, type PieceSymbol, type Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../pages/Game.pages";

import { Chess } from "chess.js";



const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const ChessBoard = ({
  board,socket , chess , playerColor
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket : WebSocket
  chess :  Chess
  playerColor : "w" | "b" | null
}) => {
    const [from ,setFrom] = useState<Square | null>(null);
    const [validMoves, setValidMoves] = useState<string[]>([]);
    
    
    useEffect(()=>{
        if(!from){
        setValidMoves([]);
        return;
        }
        const moves = chess.moves({
        square: from,
        verbose : true
        });
        const destinations = moves.map(move=>move.to);
        setValidMoves(destinations);
    },[from,chess]);
  
    return (
        <div>
            {board.map((row,i)=>(
                <div key={i} className="flex">
                    {row.map((square,j)=>{

                        //convert array position to chess position 
                        const clickedSquare = `${files[j]}${8-i}` as Square;

                        // Is this square a legal destination?
                        const isValidMove : boolean = validMoves.includes(clickedSquare);

                        const piece = chess.get(clickedSquare);

                        console.log("checking valid move....");
                        console.log(isValidMove);
                        console.log("checked  valid move!");

                        return <div key={j}
                                    onClick = {()=>{
                                        // First Click the selected piece  
                                        if(!from){

                                            const piece = chess.get(clickedSquare);
                                            if(!piece)return;
                                            if(piece.color !== playerColor)return;
                                            if(chess.turn() != playerColor)return;
                                            setFrom(clickedSquare);
                                            return;
                                        }
                                        
                                        //if from already selected means you selected the to move
                                        const newTo = clickedSquare;
                                        
                                        //second click must be valid 
                                        if(!validMoves.includes(newTo)){
                                            //if second click is not valid
                                            if(!(piece && piece.color == chess.turn()))return;
                                            setFrom(newTo);
                                            return;
                                        }

                                        console.log("From:", from);
                                        console.log("To:", newTo);

                                        socket.send(JSON.stringify({
                                            type : MOVE,
                                            move : {
                                                from : from,
                                                to : newTo
                                            }
                                        }));
                                        
                                        setFrom(null);
                                        setValidMoves([]);
                                    }}
                                    className={`relative
                                                w-16 h-16
                                                flex
                                                items-center
                                                justify-center
                                                ${ chess.isCheck() && 
                                                    piece?.type=="k" && 
                                                        piece.color == chess.turn() 
                                                            ? "bg-red-500" : from == clickedSquare 
                                                                ? "bg-yellow-400" : 
                                                                    (i + j) % 2 === 0
                                                                        ? "bg-green-300"
                                                                        : "bg-white"
                                                }
                                            `}
                                >
                                {/* Chess piece */}
                                    {square ? (
                                        <img
                                            src={`/pieces-svg/${
                                                square.color === "b"
                                                    ? square.type
                                                    : `${square.type.toUpperCase()} copy`
                                            }.svg`}
                                        />
                                    ) : null}
                                
                                {/* Valid move indicator */}
                                    {isValidMove && (
                                        <div
                                            className="
                                                absolute
                                                w-4
                                                h-4
                                                rounded-full
                                                bg-black/30
                                            "
                                        />
                                    )}
                        </div>
                    })}
                </div>
            ))}
        </div>
    );
};