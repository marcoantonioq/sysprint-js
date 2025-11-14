import { exec as childExec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const exec = promisify(childExec);

async function ensureUploadsDir() {
  const uploadDir = "/data/uploads";
  try {
    await fs.promises.access(uploadDir, fs.constants.F_OK);
  } catch (error) {
    await fs.promises.mkdir(uploadDir, { recursive: true });
  }
}

function escape(value) {
  let result = value ? value.replace(/[$`|\\{}()[\]^$+*?]/g, "\\$&") : "";
  result = result.trim();
  return result;
}

function validateSpoolRequest(o) {
  if (!o || typeof o !== "object") return false;

  const requiredFields = ["print", "copies", "path", "user"];
  for (const field of requiredFields) {
    if (
      !(field in o) ||
      (typeof o[field] !== "string" && typeof o[field] !== "number")
    ) {
      return false;
    }
  }

  const validPages = !o.pages || ["all", "odd", "even"].includes(o.pages);
  const validSided =
    !o.sided ||
    ["one-sided", "two-sided-long-edge", "two-sided-short-edge"].includes(
      o.sided
    );
  const validMedia =
    !o.media ||
    ["letter", "A3", "A4", "A5", "legal", "envelope", "photo"].includes(
      o.media
    );
  const validOrientation =
    !o.orientation || ["portrait", "landscape"].includes(o.orientation);
  const validQuality = !o.quality || ["3", "4", "5"].includes(o.quality);

  return (
    validPages && validSided && validMedia && validOrientation && validQuality
  );
}

async function lp(o) {
  let newPath = "";
  try {
    await ensureUploadsDir();

    // if (!validateSpoolRequest(o)) {
    //   throw new Error("Parâmetros inválidos!");
    // }
    if (!o.path) {
      throw new Error("Arquivo não encontrado!");
    }

    // Otimizando PDF
    console.log("Arquivo: ", o.path);

    newPath = `/data/uploads/${o.path.replace(/[^0-9]/gi, "")}2.pdf`;
    await exec(`ps2pdf /data/uploads/${o.path} ${newPath}`);

    const finalPath = fs.existsSync(newPath) ? newPath : o.path;

    const commandParts = [
      "lp -o page-left=0 -o page-right=0 -o page-top=0 -o page-bottom=0",
      `-d ${escape(o.print)}`,
      `-n ${Number(o.copies)}`,
      o.user ? `-U ${escape(o.user)}` : "",
      o.title ? `-t "${escape(o.title)}"` : "",
      "-o collate=true",
      o.range?.trim()
        ? `-o page-ranges=${escape(o.range.replace(/[^0-9,-]/gi, ""))}`
        : "",
      o.sided ? `-o sides=${escape(o.sided)}` : "",
      o.pages ? `-o page-set=${escape(o.pages)}` : "",
      o.media ? `-o media=${escape(o.media)}` : "",
      o.quality ? `-o print-quality=${escape(o.quality)}` : "",
      o.orientation ? `-o orientation-requested=${escape(o.orientation)}` : "",
      escape(finalPath),
    ].filter(Boolean);

    const command = commandParts.join(" ").replace(" -o page-set=all", "");
    console.log("Comando de impressão: ", command);

    const { stdout, stderr } = await exec(command);

    if (!stdout) {
      throw new Error("Retorno do comando lp inválido!");
    }

    const regex = new RegExp(`${o.print}-(\\d+)`, "i");
    const matchResult = stdout.match(regex);

    if (!matchResult) {
      throw new Error("Nome da impressora e/ou ID do spool não encontrados.");
    }

    const id = Number(matchResult[1]);

    if (Number.isNaN(id)) {
      throw new Error("ID do spool não é um número válido.");
    }

    const spool = {
      id,
      user: o.user,
      print: o.print,
      copies: o.copies,
      title: o.title,
      range: o.range,
      sided: o.sided,
      pages: o.pages,
      media: o.media,
      quality: o.quality,
      orientation: o.orientation,
      errors: stderr ? [stderr] : [],
      msgs: stdout ? [stdout] : [],
    };

    return spool;
  } catch (error) {
    throw error;
  } finally {
    if (newPath) {
      try {
        await exec(`rm ${newPath}`);
      } catch (err) {
        console.error("Erro ao remover arquivo:", err);
      }
    }
  }
}

export { lp };
