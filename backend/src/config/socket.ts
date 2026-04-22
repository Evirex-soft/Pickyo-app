import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected: ", socket.id);

        socket.on("join-driver", (vehicleType: string) => {
            console.log("JOIN DRIVER ROOM:", vehicleType);
            socket.join(`drivers-${vehicleType}`);

        });

        socket.on("join-user", (userId) => {
            socket.join(`user-${userId}`)
        });

        socket.on("update-location", (data) => {
            const { userId, location } = data;
            console.log(`Relaying location to user-${userId}:`, location);
            if (userId && location) {
                io.to(`user-${userId}`).emit("driver-location-updated", location);
            }
        });
    });

    return io;
};

export const getIO = () => io;