// import crypto from "crypto";
// import fileUpload from "express-fileupload";
// import { NextFunction, Request, Response } from "express";
// import { SpoolRequest } from "../../interface/SpoolsInterface";

// /**
//  * Armazenamento de dados
//  */

// /**
//  * Autenticação
//  */
// export function authenticate(req: Request, res: Response, next: NextFunction) {
//   const { username, password } = <{ username: string; password: string }>(
//     req.headers
//   );
//   if (auth(username, password)) {
//     next();
//   }
// }

// /**
//  * Serviços de impressão
//  */
// export async function print

// export async function buffer(req: Request, res: Response) {
//   const response = ResponseHandler.create(res);
//   try {
//     if (req.headers["content-type"] != "application/pdf")
//       throw new Error(
//         "Formato de arquivo inválido. Apenas arquivos PDF são suportados."
//       );
//     const fileBuffer = req.body as Buffer;
//     const path = `files/${crypto.randomBytes(8).toString("hex")}.pdf`;
//     await fs.writeFileSync(path, fileBuffer);
//     const spools = await repoSpools.lp({
//       path: path,
//       print: "ADM",
//       user: "1934155",
//       title: "1934155.pdf",
//       quality: "4",
//     });
//     response.success(spools);
//   } catch (error) {
//     const msg = `Erro ao imprimir arquivo: ${error}`;
//     response.error(msg);
//   }
// }
