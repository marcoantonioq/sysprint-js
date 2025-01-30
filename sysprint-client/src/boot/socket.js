import { Notify, Loading } from 'quasar'
import { defineBoot } from '#q-app/wrappers'
import { io } from 'socket.io-client'
import axios from 'axios'
import { runtime } from '../runtime.js'
import { app } from '../app.js'

const config = {
  auth: {
    token: localStorage.getItem('token') || '123',
  },
}

export const api = axios.create({
  baseURL: window.location.origin,
})

let socket = null
if (config.auth.token) {
  socket = io(window.location.origin, config)
}

export default defineBoot(({ app }) => {
  if (socket) {
    app.config.globalProperties.$socket = socket
  }
})

socket?.on('connect', () => {
  console.log('App conectado via socket...')
  runtime.connected = true
})

socket?.on('disconnect', () => {
  console.log('Desconectado do servidor socket!')
  runtime.connected = false
})

socket?.on('printers', (printers) => {
  console.log('Novas impressoras recebidas: ', printers)
  app.printers = [...printers]
})

socket?.on('jobs', (jobs) => {
  console.log('Novos trabalho de impressão: ', jobs)
  app.spools = jobs
})

export function sendPrint(jobs, call) {
  jobs.forEach(async (job) => {
    const formData = new FormData()
    formData.append('data', JSON.stringify(job))
    formData.append('file', job.buffer)

    Loading.show({
      message: 'Enviando arquivo...<br/><span class="text-amber text-italic">Aguarde</span>',
      html: true,
    })
    setTimeout(() => {
      Loading.hide()
    }, 30000)
    await axios.post('/api/print', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    Notify.create({
      type: 'positive',
      message: `Arquivo ${job.title} enviado para impressora...`,
      position: 'top-right',
    })
    Loading.hide()
    if (call) call(jobs)
  })
}

export { socket }
