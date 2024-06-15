import { Server } from "socket.io";
import { SocketIOService } from "./service";
import { SOCKET_EVENTS } from "../consts";

export default (expressServer) => {
  SocketIOService.instance().initialize(expressServer, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    },
  });

  const io = SocketIOService.instance().getServer();


  const userSocketMap = {}; 

  io.on("connection", async (socket) => {
    // const session = (socket.request as any).session;

    console.log("Client connected", socket.id);

    socket.emit("message", "Client connected successfully!");

    const userId = socket.handshake.query.userId as string;
    const userSocketMap = SocketIOService.instance().getRooms();

    socket.on(SOCKET_EVENTS.JOIN_CHAT, async ({ ...roomObject }) => {
      const room = roomObject.chatId;
      if (
        io.sockets.adapter.rooms.get(room) &&
        io.sockets.adapter.rooms.get(room)!.size > 0
      ) {
        socket.emit(SOCKET_EVENTS.PARTNER_JOINED);
      }
      socket.to(room).emit(SOCKET_EVENTS.PARTNER_JOINED);
      socket.join(room);
    });

    socket.on("join", async ({ ...roomObject }) => {
      const room = roomObject.chatId;
      console.log("room", room);
      socket.join(room);
      
    });

    socket.on(SOCKET_EVENTS.TYPING, function ({ chatId }) {
      socket.to(chatId).emit(SOCKET_EVENTS.TYPING);
    });

    socket.on(SOCKET_EVENTS.LEAVE_CHAT, async ({ ...roomObject }) => {
      const room = roomObject.chatId;
      socket.leave(room);
      socket.to(room).emit(SOCKET_EVENTS.PARTNER_LEFT);
    });

    socket.on(SOCKET_EVENTS.JOIN_CHATS_LIST, async ({ ...roomObject }) => {
      const room = `${roomObject.userId}_chats`;
      socket.join(room);
    });

    socket.on(SOCKET_EVENTS.LEAVE_CHATS_LIST, async ({ ...roomObject }) => {
      const room = `${roomObject.userId}_chats`;
      socket.leave(room);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    io.of("/").adapter.on("join-room", (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });


    io.of("/").adapter.on("leave-room", (room, id) => {
      socket.to(room).emit(SOCKET_EVENTS.PARTNER_LEFT);
    });
  });

  return io;
};
