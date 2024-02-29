import { app } from "./app";
import { startHTTP } from "./modules/http";
import { startLog } from "./modules/logs";

startLog(app);
startHTTP(app);

import ipp from "ipp";

// Endereço e porta do serviço CUPS
const cupsHost = "localhost";
const cupsPort = 633;

// Crie uma nova conexão com o serviço CUPS
const printer = new ipp.Printer(
  `http://${cupsHost}:${cupsPort}/printers/DCP-1602`
);

var msg = {
  "operation-attributes-tag": {
    "requesting-user-name": "myuser",
    //use these to view completed jobs...
    //	"limit": 10,
    "which-jobs": "completed",

    "requested-attributes": [
      "job-id",
      "job-uri",
      "job-state",
      "job-state-reasons",
      "job-name",
      "job-originating-user-name",
      "job-media-sheets-completed",
    ],
  },
};

printer.execute(
  "Get-Job-Attributes",
  {
    "operation-attributes-tag": {
      "which-jobs": "completed",
      "job-id": 257,
    },
  },
  (err: any, res: any) => {
    console.log("Erro: ", err);
    console.log("Sucess: ", res);
  }
);
// printer.execute("Get-Jobs", msg, function (err: any, res: any) {
//   if (err) return console.log(err);
//   console.log(res["job-attributes-tag"]);
// });
