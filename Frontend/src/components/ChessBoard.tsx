import { type Color, type PieceSymbol, type Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game.pages";

export const ChessBoard = ({
  board,socket
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket : WebSocket
}) => {
  const [from ,setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);


  return (
    <div>
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => (
            <div
              onClick={()=>{
                if(!from){
                  setFrom(square?.square ?? null);
                } else{
                  setTo(square?.square ?? null);
                  socket.send(JSON.stringify({
                    type : MOVE,
                    move : {
                      from,
                      to
                    }
                  }));
                  console.log({
                    from,
                    to
                  })
                }
              }}
              key={j}
              className={`w-16 h-16 flex items-center justify-center ${
                (i + j) % 2 === 0
                  ? "bg-green-300"
                  : "bg-white"
              }`}
            >
              {square ? square.type : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};