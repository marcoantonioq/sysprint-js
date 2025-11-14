import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import { Server } from 'socket.io'
import { setupRoutes } from './routes.js'
import { setupSocketIO } from './socket.js'
import { watchEffect } from 'vue'

export async function startHTTP(app) {
  console.log('MODULO: HTTP')
  const port = app.system?.port || '3000'
  const appExpress = express()
  const server = http.createServer(appExpress)
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  appExpress.use(bodyParser.json())
  appExpress.use(express.json({ limit: '1gb' }))
  appExpress.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Algo deu errado!')
  })

  setupRoutes(appExpress, app)
  await setupSocketIO(io, app)

  server.listen(port, () => {
    const hr =
      '######################################################################'
    console.log(`\x1b[32m\n${hr}\n\n🌟 Socket.IO na porta ${port}! 🌟\x1b[0m`)
    console.log(
      `\x1b[32m🚀 Acesse o painel adm http://localhost:${port}/ 🚀\n\n${hr}\x1b[0m`
    )
  })

  watchEffect(() => {
    if (app?.system?.rebooting) {
      server.close()
      console.log('Porta do servidor HTTP fechada! Reiniciando o servidor')
    }
  })
}
