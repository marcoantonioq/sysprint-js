import { Express, Request, Response, NextFunction } from "express";
import express from "express";
import path from "path";
import { promises as fs } from "fs";
import { App, Spool } from "../../app";
import { updatePrinterList } from "../../lib/updatePrinterList";
import { lp } from "../../lib/lp";
import multer from "multer";
import { ADAuthentication } from "./login/ad";

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
  // const messages = {
  //   successSettings: "Configurações alteradas com sucesso!",
  //   invalidToken: "Token anterior inválido!",
  // };

  appExpress.use((_req: any, _res: any, next: NextFunction) => {
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
        console.log("Falha ao relizar a impressão: ", req.body, error);
      }
      res.json(results);
    }
  );
  appExpress.post("/api/validateToken", async (req: Request, res: Response) => {
    const result = {
      msg: "",
      error: "",
      token: "",
    };
    const { token } = req.body;
    const adAuth = new ADAuthentication({
      host: app.auth.ad.host,
      secretKey: app.system.token,
    });
    const valid = await adAuth.validToken(token);
    if (valid) {
      result.msg = `Token válido!`;
    } else {
      result.error = "Token inválido!";
    }
    result.token = token;
    res.json(result);
  });

  appExpress.post("/api/login", async (req: Request, res: Response) => {
    const result = {
      msg: "",
      error: "",
      token: "",
    };

    try {
      const { username, password } = req.body;
      const adAuth = new ADAuthentication({
        host: app.auth.ad.host,
        username: `${username}@${app.auth.ad.domain}`,
        password,
        secretKey: app.system.token,
      });
      result.token = await adAuth.authenticate(
        `${username}@${app.auth.ad.domain}`,
        password
      );
      if (result.token) {
        result.msg = "Usuário autenticado com sucesso!";
      } else {
        result.error = "Credenciais inválidas";
      }
    } catch (error) {
      result.error = "Falha ao logar!";
    }

    res.json(result);
  });

  appExpress.get("/api/printers", async (req: Request, res: Response) => {
    try {
      const printers = await updatePrinterList();
      res.json({ printers });
    } catch (error) {
      console.log(`Falha ao realizar buscar impressoras: ${error}`);
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
      console.error("Falha ao criar a pasta:", err);
    }
  }
}
