import { WebSocket } from "ws";
import { type player } from "./Game.js";
export declare class GameManager {
    private games;
    private pendingUser;
    private users;
    constructor();
    addUser({ id, socket }: player): void;
    removeUser(socket: WebSocket): void;
    private addHandler;
}
//# sourceMappingURL=GameManager.d.ts.map