import { App, PageLog } from "../../app";
import { LogMonitor } from "./LogMonitor";

export async function startLog(app: App) {
  try {
    const pageLog = new LogMonitor("/var/log/cups/page_log");
    pageLog.onChange((log: any) => {
      try {
        const pageLog = JSON.parse(log) as PageLog;
        // console.log("Paginas log::: ", pageLog);
      } catch (error) {
        console.log("Erro ao ler pagina no arquivo de log: ", error);
      }
    });
  } catch (error) {
    console.log("Errro ao iniciar o log arquivo: ", error);
  }
}
