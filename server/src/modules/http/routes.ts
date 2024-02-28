import { Express, Request, Response, NextFunction } from "express";
import express from "express";
import path from "path";
import fileUpload from "express-fileupload";
import fs from "fs";
import { App, Spool } from "../../app";
import { updatePrinterList } from "../../helpers/updatePrinterList";
import { lp } from "../../helpers/lp";

export function setupRoutes(appExpress: Express, app: App): void {
  const messages = {
    successSettings: "Configurações alteradas com sucesso!",
    invalidToken: "Token anterior inválido!",
  };

  appExpress.use((req: any, res: any, next: NextFunction) => {
    next();
  });

  appExpress.use(
    "/",
    express.static(path.resolve(__dirname, "../../../../client/dist/pwa"))
  );

  appExpress.post("/api/print", async (req: Request, res: Response) => {
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
          const spoolRequest = <Spool>{
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
          const spools = await lp(spoolRequest);
          results.push(spools);
          await sleep(1000);
        } catch (error) {
          console.log("Message error lp:: ", error);
        } finally {
          try {
            fs.unlinkSync(path);
          } catch (error) {
            console.log("Erro ao remover o arquivo de impressão: ", path);
          }
        }
        console.log("Enviando");
      }
    }
    res.json(results);
  });

  appExpress.get("/api/printers", async (req: Request, res: Response) => {
    try {
      const printers = await updatePrinterList();
      res.json({ printers });
    } catch (error) {
      console.log(`Erro ao realizar buscar impressoras: ${error}`);
    }
  });
}

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
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
