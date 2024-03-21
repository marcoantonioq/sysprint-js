import { Express, Request, Response, NextFunction } from "express";
import express from "express";
import path from "path";
import { promises as fs } from "fs";
import { App, Spool } from "../../app";
import { updatePrinterList } from "../../lib/updatePrinterList";
import { lp } from "../../lib/lp";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

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

  appExpress.post(
    "/api/print",
    upload.single("file"),
    async (req: Request, res: Response) => {
      const results: any[] = [];
      try {
        const job = JSON.parse(req.body.data) as Spool;

        job.buffer = req.file?.buffer;
        job.path = req.file?.path.replace(/.*\//gi, "");

        const result = await lp(job);
        job.id = result.id;
        job.status = "printing";
        if (job.path) await fs.unlink(`uploads/${job.path}`);
        console.log("Enviando impressão: ", job);
      } catch (error) {
        console.log("Erro ao relizar a impressão: ", req.body, error);
      }
      res.json(results);
    }
  );

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
    await fs.access(path, fs.constants.F_OK);
  } catch (error) {
    try {
      await fs.mkdir(path, { recursive: true });
      console.log("Pasta criada com sucesso:", path);
    } catch (err) {
      console.error("Erro ao criar a pasta:", err);
    }
  }
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
