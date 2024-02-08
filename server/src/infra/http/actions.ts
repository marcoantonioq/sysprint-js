import crypto from "crypto";
import fileUpload from "express-fileupload";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "./ResponseHandler";
import { auth, repoPrinters, repoSpools } from "../../app";
import { SpoolRequest } from "../../interface/SpoolsInterface";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Armazenamento de dados
 */

async function createFolder(path: string) {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
  } catch (error) {
    try {
      await fs.promises.mkdir(path, { recursive: true });
      console.log("Pasta criada com sucesso:", path);
    } catch (err) {
      console.error("Erro ao criar a pasta:", err);
    }
  }
}
/**
 * Autenticação
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const { username, password } = <{ username: string; password: string }>(
    req.headers
  );
  if (auth(username, password)) {
    next();
  }
}

/**
 * Serviços de impressão
 */
export async function print(req: Request, res: Response) {
  const response = ResponseHandler.create(res);
  const results: any[] = [];

  if (req.files) {
    const files: fileUpload.UploadedFile[] =
      typeof req.files.files === "object" && Array.isArray(req.files.files)
        ? req.files.files
        : [req.files.files];

    for (const file of files) {
      await createFolder("uploads");
      const path = `uploads/${Date.now()}.pdf`;
      await file.mv(path);
      try {
        const {
          copies,
          pages,
          range,
          sided,
          media,
          quality,
          orientation,
          print,
        } = req.body;
        const spoolRequest: SpoolRequest = {
          print,
          copies: Number(copies),
          path: path,
          title: file.name,
          pages: pages || "all",
          range: range || "",
          sided,
          media: media || "A4",
          quality: quality || "4",
          orientation,
          // user: req.headers.username,
          user: "1934155",
        };
        const spools = await repoSpools.lp(spoolRequest);

        spools.forEach((spool) => {
          results.push(spool);
        });
        await sleep(1000);
      } catch (error) {
        console.log("Message error lp:: ", error);
      } finally {
        fs.unlinkSync(path);
      }
      console.log("Enviando");
    }
  }
  response.success(results);
}

export async function buffer(req: Request, res: Response) {
  const response = ResponseHandler.create(res);
  try {
    if (req.headers["content-type"] != "application/pdf")
      throw new Error(
        "Formato de arquivo inválido. Apenas arquivos PDF são suportados."
      );
    const fileBuffer = req.body as Buffer;
    const path = `files/${crypto.randomBytes(8).toString("hex")}.pdf`;
    await fs.writeFileSync(path, fileBuffer);
    const spools = await repoSpools.lp({
      path: path,
      print: "ADM",
      user: "1934155",
      title: "1934155.pdf",
      quality: "4",
    });
    response.success(spools);
  } catch (error) {
    const msg = `Erro ao imprimir arquivo: ${error}`;
    response.error(msg);
  }
}

export async function printers(req: Request, res: Response) {
  const response = ResponseHandler.create(res);
  try {
    const printers = await repoPrinters.list();
    // console.log("Lista de impressoras: ", printers);
    response.success(printers);
  } catch (error) {
    response.error(`Erro ao realizar a impressão: ${error}`);
  }
}
