import { exec as childExec } from "child_process";
import { promisify } from "util";
import { Printer } from "../app";

const exec = promisify(childExec);

async function getPrinterNames(): Promise<string[]> {
  try {
    const { stdout, stderr } = await exec("/usr/bin/lpstat -a");
    if (stderr) {
      throw new Error(`Falha ao obter a lista de impressoras: ${stderr}`);
    }
    if (typeof stdout !== "string") {
      throw new Error(
        `Saída lpstat inválida ou não ha impressoras configurada!`
      );
    }

    return stdout
      .trim()
      .split("\n")
      .map((line) => line.split(/\s+/)[0]);
  } catch (error) {
    throw new Error(
      `Falha ao executar ou não há impressora instalada: ${error}`
    );
  }
}

async function getPrinterDetails(printerName: string): Promise<Printer> {
  try {
    const { stdout, stderr } = await exec(`lpstat -l -p ${printerName}`);
    if (stderr) {
      throw new Error(`Falha encontrado: ${stderr}`);
    }

    const details: Printer = {
      name: printerName,
      status: "",
      location: "",
      info: "",
      description: "",
      model: "",
      driver: "",
    };

    stdout
      .trim()
      .split("\n")
      .forEach((line) => {
        const [key, value] = line.split(":").map((item) => item.trim());
        if (/está inativa|desabilitada|disable/i.test(key)) {
          details.status += ` ${key
            .replace(/;.*|\w+ \w+ \d\d \w+ \d{4} \d\d/gi, "")
            .trim()}.`;
        } else if (/localização|location/i.test(key)) {
          details.location = value;
        } else if (/(alerts|alertas)/i.test(key)) {
          details.info = value.replace(/none/i, "");
        } else if (/description|descrição/i.test(key)) {
          details.description = value;
        } else if (/make and model|modelo/i.test(key)) {
          details.model = value;
        }
      });

    return details;
  } catch (error) {
    console.error("Falha ao obter dados de impressora:", error);
    return {
      name: printerName,
      status: "",
      location: "",
      info: "",
      description: "",
      model: "",
      driver: "",
    };
  }
}

async function updatePrinterList(): Promise<Printer[]> {
  try {
    const printerNames = await getPrinterNames();
    const printerDetailsPromises = printerNames.map(getPrinterDetails);
    const printers = await Promise.all(printerDetailsPromises);

    return printers;
  } catch (error) {
    console.error("Falha ao atualizar a lista de impressoras:", error);
    return [];
  }
}

export { updatePrinterList };
