import { App } from "../../app";
import { LogMonitor } from "./LogMonitor";

export async function startLog(_app: App) {
  try {
    const pageLog = new LogMonitor("/var/log/cups/page_log");
    pageLog.onChange((logs: string) => {
      try {
        const values = logs
          .split("\n")
          .map((e) => {
            try {
              return JSON.parse(e.replace(/\\/gi, ""));
            } catch (error) {
              console.log("Falha ao converter o valor do log: ", e);
            }
          })
          .filter((e) => e);
        console.log("LOGs: ", values);
      } catch (error) {
        console.log("Falha ao ler pagina no arquivo de log: ", error);
      }
    });
  } catch (error) {
    console.log("Falha ao iniciar o log arquivo: ", error);
  }
}
