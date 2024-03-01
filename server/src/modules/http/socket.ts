import { Server } from "socket.io";
import { App, Printer, Spool } from "../../app";
import { promises as fs } from "fs";
import { lp } from "../../lib/lp";
import { watch } from "vue";

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
  io.on("connection", (socket) => {
    socket.emit("msg", "Client conectado!");

    // socket.emit("printers", app.printers);
    watch(
      () => app.printers,
      () => {
        console.log("Enviando novas impressoras: ", app.printers.length);
        socket.emit("printers", app.printers);
      }
    );

    socket.on(
      "sendPrint",
      async (jobs: Spool[], call?: (jobs: Spool[]) => void) => {
        const results = await Promise.all(
          jobs.map(async (job) => {
            if (job.buffer) {
              job.path = `${Date.now()}${job.title?.replace(
                /[^a-z0-9]/,
                ""
              )}.pdf`;
              await fs.writeFile(`uploads/${job.path}`, job.buffer as Buffer);
              const result = await lp(job);
              job.id = result.id;
              job.status = "printing";
              await fs.unlink(`uploads/${job.path}`);
              console.log("Enviando impressão: ", job);
            } else {
              console.log("Arquivo não enviado: ", job.title);
            }
            return job;
          })
        );
        results.forEach((e) => {
          app.spools.push(e);
        });
        if (call) call(results);
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
