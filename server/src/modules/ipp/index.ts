import ipp from "ipp";
import { App } from "../../app";

export async function startIPP(app: App) {
  console.log("MODULO: IPP");
}

// Endereço e porta do serviço CUPS
const CUPS_HOST = "http://localhost:631";

// Crie uma nova conexão com o serviço CUPS
const printer = new ipp.Printer(`${CUPS_HOST}/printers/ADM`);

// printer.execute(
//   "Get-Job-Attributes",
//   {
//     "operation-attributes-tag": {
//       "which-jobs": "completed",
//       "job-id": 257,
//     },
//   },
//   (err: any, res: any) => {
//     console.log("Success: ", res);
//   }
// );

// printer.execute(
//   "Get-Jobs",
//   {
//     "operation-attributes-tag": {
//       limit: 10,
//       "attributes-charset": "utf-8",
//       "requested-attributes": ["all"],
//     },
//   },
//   function (err: any, res: any) {
//     if (err) return console.log(err);
//     console.log(res);
//   }
// );

// printer.execute(
//   "Get-Printer-Attributes",
//   {
//     "operation-attributes-tag": {
//       limit: 10,
//       "attributes-charset": "utf-8",
//       "requested-attributes": ["all"],
//     },
//   },
//   function (err: any, res: any) {
//     if (err) return console.log(err);
//     console.log(res);
//   }
// );