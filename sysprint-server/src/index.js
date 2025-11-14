import { app } from './app.js'
import { startHTTP } from './modules/http/index.js'
import { startIPP } from './modules/ipp/index.js'
import { startLog } from './modules/logs/index.js'
import { LogLevel, logger } from './modules/logs/Logger.js'

logger.setLogLevel(LogLevel.INFO)

startLog(app)
startHTTP(app)
startIPP(app)
logger.info('Sysprint server started')
