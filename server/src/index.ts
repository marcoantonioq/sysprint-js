import { app } from "./app";
import { startHTTP } from "./modules/http";
import { startLog } from "./modules/logs";

startLog(app);
startHTTP(app);
