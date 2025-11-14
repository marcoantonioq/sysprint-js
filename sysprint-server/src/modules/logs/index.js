import { LogMonitor } from './LogMonitor.js'
import fs from 'fs'
import { logger } from './Logger.js'

function ensureLogFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '')
  }
}

function appendLogsToFile(filePath, logs) {
  const logData = logs.map((value) => JSON.stringify(value)).join('\n') + '\n'
  fs.appendFileSync(filePath, logData)
}

ensureLogFileExists('/data/page_log')

export async function startLog(_app) {
  try {
    const pageLog = new LogMonitor('/var/log/cups/page_log')
    pageLog.onChange((logs) => {
      try {
        const values = logs
          .split('\n')
          .map((e) => {
            try {
              return JSON.parse(e.replace(/\\/gi, ''))
            } catch (error) {
              logger.error(`Falha ao converter o valor do log: ${e}`)
            }
          })
          .filter((e) => e)
        console.info(`LOGs: ${JSON.stringify(values)}`)

        if (values.length > 0) {
          try {
            appendLogsToFile('/data/page_log', values)
          } catch (error) {
            logger.error(`Falha ao enviar os logs para o servidor: ${error}`)
          }
        }
      } catch (error) {
        logger.error(`Falha ao ler pagina no arquivo de log: ${error}`)
      }
    })
  } catch (error) {
    logger.error(`Falha ao iniciar o log arquivo: ${error}`)
  }
}
