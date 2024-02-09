import { EventEmitter } from "events";
import ActiveDirectory from "activedirectory2";
import { LogMonitor } from "../infra/logs/LogMonitor";
import { RepositorySpools } from "../repo/SpoolsRepository";
import { RepositoryPrinters } from "../repo/PrintersRepository";
import { PageLog } from "./Interfaces";
import config from "./config";

/**
 * Repositórios
 */
const events = new EventEmitter();
export const repoSpools = new RepositorySpools([], events);
export const repoPrinters = new RepositoryPrinters([], events);

/**
 * Monitoramento de logs
 */
try {
  const pageLog = new LogMonitor("/var/log/cups/page_log", events);
  pageLog.start();
  pageLog.events.on("log", (log: any) => {
    try {
      const pageLog = JSON.parse(log) as PageLog;
      console.log("Paginas log::: ", pageLog);
    } catch (error) {
      console.log(error);
    }
  });
} catch (error) {
  console.error(`Erro ao analisar entrada de registro: ${error}`);
}

/**
 * Auth
 * @param username string
 * @param password string
 * @param type AD
 * @returns boolean
 */
export function auth(username: string, password: string, type: string = "AD") {
  if ((type = "AD")) {
    if (username && password) {
      const ad = new ActiveDirectory(config.auth.ad);
      // ad.authenticate(`${username}`, `${password}`, (err: Error, auth: boolean) => {
      return true;
    } else {
      return false;
    }
  }
}
