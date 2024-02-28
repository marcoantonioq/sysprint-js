import { App, PageLog } from "../../app";
import { LogMonitor } from "./LogMonitor";
import EventEmitter from "events";
const events = new EventEmitter();

export async function startLog(app: App) {
  try {
    const pageLog = new LogMonitor("/var/log/cups/page_log", events);
    pageLog.start();
    pageLog.events.on("log", (log: any) => {
      try {
        const pageLog = JSON.parse(log) as PageLog;
        console.log("Paginas log::: ", pageLog);
      } catch (error) {
        console.log("Erro ao ler pagina no arquivo de log: ", error);
      }
    });
  } catch (error) {
    console.log("Errro ao iniciar o log arquivo: ", error);
  }
}
