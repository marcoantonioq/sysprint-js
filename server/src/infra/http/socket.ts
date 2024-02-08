import { Server, Socket } from "socket.io";

enum EVENTS {
  CONNECT = "connection",
  MESSAGE = "message",
  ERROR = "error",
  EVENTOS = "eventos",
  SAVE = "save",
  REMOVE = "remove",
  ALL = "all",
  RELOAD = "reload",
}

export function setupSocketIO(io: Server): void {
  io.on(EVENTS.CONNECT, async (socket: Socket) => {
    // const { token } = socket.handshake.auth;

    console.log("Cliente conectado:", socket.id);
    socket.emit(EVENTS.MESSAGE, "Conectado");
  });
}

async function handleInvalidToken(
  socket: Socket,
  io: Server,
  errorMessage: string
): Promise<void> {
  console.log(errorMessage);
  io.emit(EVENTS.ERROR, { msg: errorMessage });
  socket.disconnect();
}
