import { app } from "./app";
import { startHTTP } from "./modules/http";
import { startIPP } from "./modules/ipp";
import { startLog } from "./modules/logs";

startLog(app);
startHTTP(app);
startIPP(app);
