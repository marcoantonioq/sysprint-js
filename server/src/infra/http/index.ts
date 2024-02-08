import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";
import { setupRoutes } from "./routes";
import { setupSocketIO } from "./socket";

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb", extended: true }));

const server = http.createServer(app);
const io: Server = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());

setupRoutes(app);
setupSocketIO(io);

io.on("connection", (socket) => {
  socket.emit("msg", "Client conectado!");
});

io.sockets.on("connection", function (socket) {
  console.log(`ID: ${socket.id} entrou`);
  socket.on("disconnect", () => {
    console.info(`ID: ${socket.id} saiu`);
  });
});

function start() {
  server
    .listen("3000", () => {
      console.info(`API: http://SERVER:3000\nCUPS: http://SERVER:631`);
    })
    .on("error", (error) => {
      console.log("Erro ao iniciar o servidor http:::", error);
    });
}

export default {
  app,
  io,
  start,
};
