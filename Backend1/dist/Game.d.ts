import WebSocket from "ws";
export declare class Game {
    player1: WebSocket;
    player2: WebSocket;
    private board;
    private moves;
    private startTime;
    private moveCount;
    constructor(player1: WebSocket, player2: WebSocket);
    makeMove(socket: WebSocket, move: {
        to: string;
        from: string;
    }): void;
}
//# sourceMappingURL=Game.d.ts.map