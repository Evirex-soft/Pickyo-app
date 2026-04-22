import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = (userId: string, role: "driver" | "user", vehicleType?: string) => {
    socket = io("http://localhost:5000", {
        transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log("Socket connected: ", socket.id);

        if (role === "driver" && vehicleType) {
            socket.emit("join-driver", vehicleType);
        } else if (role === "user") {
            socket.emit("join-user", userId);
        }
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) throw new Error("Socket not initialized");
    return socket;
}