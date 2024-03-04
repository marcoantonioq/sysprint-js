import { Server } from "socket.io";
import { App, Printer, Spool } from "../../app";
import { promises as fs } from "fs";
import { lp } from "../../lib/lp";
import { watch } from "vue";

enum EVENTS {
  CONNECT = "connection",
  MESSAGE = "message",
  JOBS = "jobs",
  PRINTERS = "printers",
  SEND_PRINT = "sendPrint",
  ERROR = "error",
  EVENTOS = "eventos",
  SAVE = "save",
  REMOVE = "remove",
  ALL = "all",
  RELOAD = "reload",
}

export async function setupSocketIO(io: Server, app: App): Promise<void> {
  io.on(EVENTS.CONNECT, (socket) => {
    console.log(`ID: ${socket.id} entrou`);
    socket.on("disconnect", () => {
      console.info(`ID: ${socket.id} saiu`);
    });

    socket.emit(EVENTS.PRINTERS, app.printers);
    watch(
      () => app.printers,
      () => {
        socket.emit(EVENTS.PRINTERS, app.printers);
      }
    );

    socket.on(
      EVENTS.SEND_PRINT,
      async (jobs: Spool[], call?: (jobs: Spool[]) => void) => {
        const results = await Promise.all(
          jobs.map(async (job) => {
            if (job.buffer) {
              job.path = `${Date.now()}${job.title?.replace(
                /[^a-z0-9]/gi,
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
}
