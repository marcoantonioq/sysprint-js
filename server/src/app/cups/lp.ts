import path from "path";
import { Spool } from "../../core/Spools";
import { SpoolRequest } from "../../interface/SpoolsInterface";
import { exec as childExec } from "child_process";
import { promisify } from "util";

const exec = promisify(childExec);

function escape(value: string) {
  if (typeof value === "string") {
    return value.replace(/[$`|\\{}()[\]^$+*?]/g, "\\$&");
  } else {
    return "";
  }
}

function isSpoolRequest(o: any): o is SpoolRequest {
  return (
    o &&
    typeof o === "object" &&
    typeof o.print === "string" &&
    typeof o.copies === "number" &&
    typeof o.path === "string" &&
    typeof o.user === "string" &&
    (!o.pages || ["all", "odd", "even"].includes(o.pages)) &&
    (!o.sided ||
      ["one-sided", "two-sided-long-edge", "two-sided-short-edge"].includes(
        o.sided
      )) &&
    (!o.media ||
      ["letter", "A3", "A4", "A5", "legal", "envelope", "photo"].includes(
        o.media
      )) &&
    (!o.orientation || ["portrait", "landscape"].includes(o.orientation)) &&
    (!o.quality || ["3", "4", "5"].includes(o.quality))
  );
}

export async function lp(o: SpoolRequest): Promise<Spool> {
  let newPath = "";
  try {
    if (!isSpoolRequest(o)) {
      throw new Error("Parâmetros inválidos!");
    }
    if (!o.path) throw new Error("Arquivo não encontrado!");

    // Otimizando PDF
    newPath = `uploads/${o.path.replace(/[^0-9]/gi, "")}2.pdf`;
    await exec(`ps2pdf ${o.path} ${newPath}`);

    const commandParts = [
      "lp",
      `-d ${escape(o.print)}`,
      `-n ${Number(o.copies)}`,
      o.user ? `-U ${escape(o.user)}` : "",
      o.title ? `-t "${escape(o.title)}"` : "",
      "-o collate=true",
      o.range && o.range.replace(/[^0-9,-]/gi, "")
        ? `-o page-ranges=${escape(o.range.replace(/[^0-9,-]/gi, ""))}`
        : "",
      o.sided ? `-o sides=${escape(o.sided)}` : "",
      o.pages ? `-o page-set=${escape(o.pages)}` : "",
      o.media ? `-o media=${escape(o.media)}` : "",
      o.quality ? `-o print-quality=${escape(o.quality)}` : "",
      o.orientation ? `-o orientation-requested=${escape(o.orientation)}` : "",
      escape(`${newPath}`),
    ];

    const command = commandParts
      .filter((e) => e)
      .join(" ")
      .replace(" -o page-set=all", "");

    console.log("Comando de impressão::: ", command);

    const spool = Spool.create(o);
    try {
      const { stdout, stderr } = await exec(command);
      spool.errors.push(stderr);
      spool.msgs.push(stdout);
      if (stdout) {
        const job = stdout.match(/\w-(\d+)/);
        if (job && job[1]) {
          spool.id = Number(job[1]);
        }
      }
    } catch (error) {
      spool.errors.push(`${error}`);
    }
    return spool;
  } catch (error) {
    throw `${error}`;
  } finally {
    await exec(`rm ${newPath}`);
  }
}

// lp({
//   print: "ADM",
//   copies: 1,
//   range: "1",
//   sided: "two-sided-long-edge",
//   pages: "all",
//   media: "A4",
//   quality: "4",
//   orientation: "landscape",
//   path: "uploads/1707157664822.pdf",
//   title: "arq.pdf",
//   user: "1934155",
// }).then((...arg) => {
//   console.log("Resultados da impressão: ", arg);
// });
