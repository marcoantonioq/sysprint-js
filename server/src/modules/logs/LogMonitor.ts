import * as fs from "fs";

export class LogMonitor {
  private filePath: string;
  private lastProcessedIndex: number;
  private watcher: fs.FSWatcher | null;
  private changeCallbacks: ((data: string) => void)[] = [];

  constructor(filePath: string) {
    this.filePath = filePath;
    this.lastProcessedIndex = 0;
    this.watcher = null;
    this.start();
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

  onChange(callback: (data: string) => void) {
    this.changeCallbacks.push(callback);
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
        const values = data.split("\n");
        const rows = values.slice(this.lastProcessedIndex);
        for (const row of rows) {
          if (row.trim() !== "") {
            this.notifyChangeListeners(row);
          }
        }
        this.lastProcessedIndex = values.length - 1;
      } catch (error) {
        console.error("Erro readFile:::", error);
      }
    });
  }

  private notifyChangeListeners(data: string) {
    for (const callback of this.changeCallbacks) {
      callback(data);
    }
  }
}
