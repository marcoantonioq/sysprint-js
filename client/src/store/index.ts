import config from "@/config";
import axios from "axios";
import { reactive } from "vue";

export interface Printer {
  description: string;
  driver: string;
  info: string;
  location: string;
  model: string;
  name: string;
  status: string;
}

export interface Spool {
  id: number;
  user: string;
  printer: string;
  files: File[];
  copies: number;
  range: string;
  sided: string;
  pages: string;
  quality: "3" | "4" | "5";
  media: "A4" | "A3" | "";
  orientation: string;
  status: string;
  msgs: string[];
  title: string;
}

export interface DataPrinter {
  printer: Printer;
  spool: Spool;
}
export interface App {
  printers: Printer[];
  server: {
    host: string;
    connected: boolean;
  };
  spools: Spool[];
}

export const app = reactive(<App>config);

export async function print(spool: Spool): Promise<Spool[]> {
  const spools: Spool[] = [];
  const body = new FormData();
  body.append("print", spool.printer);
  body.append("copies", String(spool.copies));
  body.append("range", spool.range);
  body.append("sided", spool.sided);
  body.append("pages", spool.pages);
  body.append("media", spool.media);
  body.append("quality", spool.quality);
  body.append("orientation", spool.orientation);
  spool.files.forEach((file: File) => {
    body.append("files", file, file.name);
  });

  try {
    spool.status = "Enviando...";
    const results = (
      await axios.post(`${app.server.host}/api/print`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
    spool.status = "Enviado";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results.data.forEach((res: any) => {
      spool.id = res.id;
      spool.msgs = res.msgs;
      spool.user = res.user;
      spool.title = res.title;
      spools.push(<Spool>JSON.parse(JSON.stringify(spool)));
    });
  } catch (err) {
    console.log("Erro ao enviar impressão: ", err);
  }
  return spools;
}

try {
  axios
    .get(`${app.server.host}/api/printers`)
    .then((res) => {
      app.printers = res.data.data;
      app.server.connected = true;
    })
    .catch((error) => {
      console.log("Erro interno no servidor: ", error);
      app.server.connected = false;
    });
} catch (error) {
  console.log("Erro ao conectar no servidor: ", error);
}

export default app;
