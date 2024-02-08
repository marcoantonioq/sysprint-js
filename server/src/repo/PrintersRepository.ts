import { Printer } from "../core/Printers";
import { InterfaceRepository, PrintData } from "../interface/PrintersInterface";
import { EventEmitter } from "events";
import { exec } from "child_process";

export class RepositoryPrinters implements InterfaceRepository {
  constructor(
    private readonly data: Printer[],
    public event: EventEmitter = new EventEmitter()
  ) {
    this.autoUpdate();
  }
  add(print: PrintData): Promise<PrintData> {
    throw new Error("Method not implemented.");
  }
  async list(): Promise<Printer[]> {
    return this.data;
  }

  private async updatePrinterList() {
    const names: string[] = await new Promise((resolve, reject) => {
      exec("/usr/bin/lpstat -a", (error, stdout, stderr) => {
        if (error) {
          reject(
            `Erro ao executar o comando ou não há impressora instalada: ${error}`
          );
          return;
        }
        if (stderr) {
          reject(`Erro ao obter a lista de impressoras: ${stderr}`);
          return;
        }
        const printers: string[] = [];
        const lines: string[] = stdout.trim().split("\n");
        for (const line of lines) {
          const [name] = line.split(/\s+/);
          printers.push(name);
        }
        resolve(printers);
      });
    });

    const printers: Printer[] = await Promise.all(
      names.map(async (print) => {
        return await new Promise((resolve, reject) => {
          exec(`lpstat -l -p ${print}`, (error, stdout, stderr) => {
            const details: Printer = Printer.create({ name: print });
            try {
              if (error || stderr) {
                throw `Erro encontrado: ${error}\n${stderr}`;
              }
              const lines: string[] = stdout.trim().split("\n");
              for (const line of lines) {
                const [key, value] = line.split(":").map((item) => item.trim());
                if (/está inativa|desabilitada|disable/i.test(key)) {
                  details.status = `${details.status} ${key}.`
                    .replace(/;.*|\w+ \w+ \d\d \w+ \d{4} \d\d/gi, "")
                    .replace(/ {1,}.$/, "")
                    .trim();
                } else if (/localização|location/i.test(key)) {
                  details.location = value;
                } else if (/(alerts|alertas)/i.test(key)) {
                  details.info = value.replace(/none/i, "");
                } else if (/description|descrição/i.test(key)) {
                  details.description = value;
                } else if (/make and model|modelo/i.test(key)) {
                  details.model = value;
                }
              }
            } catch (error) {
              console.log("Erro ao obter dados de impressora::", error);
            }
            resolve(details);
          });
        });
      })
    );

    this.data.length = 0;
    printers.forEach((print) => {
      this.data.push(print);
    });

    return this.data;
  }

  private async autoUpdate() {
    setInterval(async () => {
      try {
        await this.updatePrinterList();
      } catch (error) {
        console.log("Erro ao atualizar o arquivo de log:::", error);
      }
    }, 20000);
  }
}
