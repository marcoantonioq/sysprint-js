import * as fs from "fs";
import { EventEmitter } from "events";

export class LogMonitor {
  private filePath: string;
  private lastProcessedIndex: number;
  private watcher: fs.FSWatcher | null;

  constructor(
    filePath: string,
    public events: EventEmitter = new EventEmitter()
  ) {
    this.filePath = filePath;
    this.lastProcessedIndex = 0;
    this.watcher = null;
  }

  start() {
    this.check();
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  private check() {
    fs.access(this.filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.info(`Aguardando arquivo ${this.filePath}`);
        setTimeout(() => {
          this.check();
        }, 60000);
      } else {
        this.startWatching();
        this.read();
      }
    });
  }

  private startWatching() {
    this.watcher = fs.watch(this.filePath, (eventType) => {
      if (eventType === "change") {
        this.read();
      } else {
        this.lastProcessedIndex = 0;
      }
    });
  }

  private read() {
    fs.readFile(this.filePath, "utf8", (err, data) => {
      try {
        if (err) {
          console.error(`Erro ao ler o arquivo de log: ${err}`);
          this.lastProcessedIndex = 0;
          return;
        }
        const logs = data.split("\n");
        const newLogs = logs.slice(this.lastProcessedIndex);
        for (const log of newLogs) {
          if (log.trim() !== "") {
            this.events.emit("log", log);
          }
        }
        this.lastProcessedIndex = logs.length - 1;
      } catch (error) {
        console.log("Erro readFile:::", error);
      }
    });
  }
}
