import { promises as fs } from 'fs'
import { lp } from '../../lib/lp.js'
import { watch } from 'vue'

const EVENTS = {
  CONNECT: 'connection',
  MESSAGE: 'message',
  JOBS: 'jobs',
  PRINTERS: 'printers',
  SEND_PRINT: 'sendPrint',
  ERROR: 'error',
  EVENTOS: 'eventos',
  SAVE: 'save',
  REMOVE: 'remove',
  ALL: 'all',
  RELOAD: 'reload',
}

export async function setupSocketIO(io, app) {
  io.on(EVENTS.CONNECT, (socket) => {
    console.log(`ID: ${socket.id} entrou`)
    socket.on('disconnect', () => {
      console.info(`ID: ${socket.id} saiu`)
    })

    socket.emit(EVENTS.PRINTERS, app.printers)
    watch(
      () => app.printers,
      () => {
        console.log('Enviando novas impressoras...', app.printers)
        socket.emit(EVENTS.PRINTERS, app.printers)
      }
    )

    socket.on(EVENTS.SEND_PRINT, async (jobs, file, call) => {
      try {
        console.log('JOB recebido: ', jobs, file)
        const results = await Promise.all(
          jobs.map(async (job) => {
            try {
              if (job.buffer) {
                job.path = `/data/uploads/${Date.now()}${job.title?.replace(
                  /[^a-z0-9]/gi,
                  ''
                )}.pdf`
                await fs.writeFile(job.path, file)
                const result = await lp(job)
                job.id = result.id
                job.status = 'printing'
                await fs.unlink(job.path)
                console.log('Enviando impressão: ', job)
              } else {
                console.log('Arquivo não enviado: ', job.title)
              }
            } catch (error) {
              console.log('Erro ao enviar o arquivo: ', error)
            }
            return job
          })
        )
        results.forEach((e) => {
          app.spools.push(e)
        })
        if (call) call(results)
      } catch (error) {
        console.log('Erro ao enviar impressão: ', error)
      }
    })
  })
}
