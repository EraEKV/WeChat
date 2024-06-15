import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import connectDB from "./db";
import initWebsockets from "./websockets/server";
import globalRouter from "./global-router";
import { logger } from "./logger";
import { Server } from "socket.io";

connectDB();

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN
  }
})



app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: '*', 
  exposedHeaders: '*',
  credentials: true
}));

app.use(express.json());
app.use(logger);
app.use("/api/v1/", globalRouter);

io.on("connection", (socket) => {
  console.log("user connected")
  socket.send("Client connected successfully!")
  console.log(socket)
});

app.get("/", (req, res) => {
  res.send("test")
})

server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});

initWebsockets(server);
