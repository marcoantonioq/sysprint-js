import { Printer } from "ipp";
import { Spool } from "../app";

const CUPS_HOST = "http://localhost:631";

interface JobAttributes {
  [key: string]: any;
}

export function watchJobStatus(job: Spool): Promise<Spool> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      try {
        const printer = new Printer(`${CUPS_HOST}/ipp/${job.print}`);
        printer.execute(
          "Get-Job-Attributes",
          {
            "operation-attributes-tag": {
              "job-id": job.id,
              "requested-attributes": [
                "job-state",
                "job-impressions-completed",
              ],
            },
          },
          (err, res) => {
            try {
              if (err) throw err;
              if (!res["job-attributes-tag"])
                throw new Error("Atributos não encontrados...");
              const tag: JobAttributes = res["job-attributes-tag"];

              switch (tag["job-state"]) {
                case "pending":
                case "pending-held":
                case "processing":
                case "processing-stopped":
                  if (job.status !== "printing") job.status = "printing";
                  break;
                case "completed":
                  if (job.status !== "printed") job.status = "printed";
                  break;
                case "canceled":
                case "aborted":
                  job.status = "cancel";
                  break;
                default:
                  break;
              }
              job.printed = +tag["job-impressions-completed"] || 0;
              if (["printed", "cancel"].includes(job.status || "")) {
                clearInterval(interval);
                resolve(job);
              }
            } catch (error) {
              clearInterval(interval);
              return reject(err);
            }
          }
        );
      } catch (e) {
        job.msgs.push("Erro sync job::" + e);
        clearInterval(interval);
        reject(job);
      }
    }, 3000);
  });
}
