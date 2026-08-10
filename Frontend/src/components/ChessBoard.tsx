import { type Color, type PieceSymbol, type Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game.pages";


const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

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
                const clickedSquare =  `${files[j]}${8-i}` as Square;
                if(!from){
                  setFrom(clickedSquare);
                } else{
                  const newTo = `${files[j]}${8-i}` as Square;
                  console.log("From:", from);
                  console.log("To:", newTo);

                  socket.send(
                    JSON.stringify({
                        type: MOVE,
                        move: {
                            from: from,
                            to: newTo
                        }
                    })
                  );
                  setFrom(null);
                  setTo(newTo);
                }
              }}
              key={j}
              className={`w-16 h-16 flex items-center justify-center ${
                (i + j) % 2 === 0
                  ? "bg-green-300"
                  : "bg-white"
              }`}
            >
              <div>
                {square ? (
                  <img
                      src={`/pieces-svg/${square.color === "b"
                          ? square.type
                          : `${square.type.toUpperCase()} copy`
                      }.svg`}
                  />
                ) : null}              
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};