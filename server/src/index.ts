import { app } from "./app";
import { startHTTP } from "./modules/http";
import { startIPP } from "./modules/ipp";
import { startLog } from "./modules/logs";
import { LogLevel, Logger } from "./modules/logs/Logger";

Logger.setLogLevel(LogLevel.DEBUG);

startLog(app);
startHTTP(app);
startIPP(app);
