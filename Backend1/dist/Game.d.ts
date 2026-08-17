import WebSocket from "ws";
export type GAME_STATUS = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'TIME_UP' | 'PLAYER_EXIT';
export interface player {
    id: number;
    socket: WebSocket;
    color?: "w" | "b";
}
export declare class Game {
    player1: player;
    player2: player;
    private board;
    private moves;
    private startTime;
    private moveCount;
    private gameId;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'TIME_UP' | 'PLAYER_EXIT';
    constructor(player1: player, player2: player, gameId?: string);
    createGameHandler(): Promise<void>;
    createGameInDb(): Promise<void>;
    handleDisconnect(id: number): Promise<void>;
    makeMove(socket: WebSocket, move: {
        to: string;
        from: string;
    }): Promise<void>;
}
//# sourceMappingURL=Game.d.ts.map