import { Express, Request, Response, NextFunction } from "express";
import express from "express";
import path from "path";
import { ResponseHandler } from "./ResponseHandler";
import { authenticate, buffer, printers, print } from "./actions";

export function setupRoutes(app: Express): void {
  const messages = {
    successSettings: "Configurações alteradas com sucesso!",
    invalidToken: "Token anterior inválido!",
  };

  app.use((req: any, res: any, next: NextFunction) => {
    next();
  });

  app.use("/admin", express.static(path.resolve(__dirname, "admin")));

  app.use(
    "/",
    express.static(path.resolve(__dirname, "../../../../client/dist"))
  );

  app.post("/api/print", print);
  app.post("/api/buffer", authenticate, buffer);
  app.get("/api/printers", printers);
}
