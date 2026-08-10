import { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        console.log("Creating WebSocket!");

        const ws = new WebSocket(WS_URL);

        socketRef.current = ws;

        ws.onopen = () => {
            console.log("Connected!");
            setSocket(ws);
        };

        ws.onclose = () => {
            console.log("Disconnected!");

            // Only clear state if this is the current socket
            if (socketRef.current === ws) {
                setSocket(null);
                socketRef.current = null;
            }
        };

        ws.onerror = (error) => {
            console.log("WebSocket error:", error);
        };

        return () => {
            console.log("Cleaning WebSocket!");

            if (socketRef.current === ws) {
                socketRef.current = null;
            }

            ws.close();
        };
    }, []);

    return socket;
};