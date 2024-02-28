import { Server } from "socket.io";
import { App, Printer, Spool } from "../../app";
import { updatePrinterList } from "../../helpers/updatePrinterList";
import { promises as fs, watch } from "fs";
import { lp } from "../../helpers/lp";

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

export async function setupSocketIO(io: Server, app: App): Promise<void> {
  app.printers = await updatePrinterList();

  io.on("connection", (socket) => {
    socket.emit("msg", "Client conectado!");

    socket.emit("printers", app.printers);

    socket.on(
      "sendPrint",
      async (
        printer: Printer,
        spool: Spool,
        files: { filename: string; data: Buffer }[]
      ) => {
        console.log(`Recebido arquivo (${files[0].filename})`);
        for (const { filename, data } of files) {
          try {
            const path = `${Date.now()}.pdf`;
            await fs.writeFile(`uploads/${path}`, data);
            spool.print = printer.name;
            spool.title = filename;
            spool.path = path;
            const job = await lp(spool);
            job.status = "printing";
            app.spools.push(job);
            console.log("Enviando impressão: ", job);
            await fs.unlink(`uploads/${path}`);
            socket.emit("job", job);
          } catch (error) {
            console.log("error::: ", error);
          }
        }
      }
    );
  });

  io.sockets.on("connection", function (socket) {
    console.log(`ID: ${socket.id} entrou`);
    socket.on("disconnect", () => {
      console.info(`ID: ${socket.id} saiu`);
    });
  });
}
