import { Notify } from 'quasar';
import { boot } from 'quasar/wrappers';
import { Socket, io } from 'socket.io-client';
import { Spool, app } from 'src/app';
import { runtime } from 'src/runtime';
import axios from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $socket: Socket;
  }
}

const config = {
  auth: {
    token: localStorage.getItem('token') || '123',
  },
};

export const api = axios.create({
  baseURL: window.location.origin,
});

let socket: Socket | null = null;
if (config.auth.token) {
  socket = io(window.location.origin, config);
}

export default boot(({ app }) => {
  if (socket) {
    app.config.globalProperties.$socket = socket;
  }
});

socket?.on('connect', () => {
  console.log('App conectado via socket...');
  runtime.connected = true;
});

socket?.on('disconnect', () => {
  console.log('Desconectado do servidor socket!');
  runtime.connected = false;
});

socket?.on('printers', (printers) => {
  console.log('Novas impressoras recebidas: ', printers);
  app.printers = [...printers];
});

socket?.on('jobs', (jobs: Spool[]) => {
  console.log('Novos trabalho de impressão: ', jobs);
  app.spools = jobs;
});

export function sendPrint(jobs: Spool[], call?: (jobs: Spool[]) => void) {
  jobs.forEach(async (job) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(job));
    formData.append('file', job.buffer as File);
    const response = await axios.post('/api/print', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Resposta: ', response.data);
    // socket?.emit('sendPrint', [job], file, (jobs: Spool[]) => {
    //   const type =
    //     job.status === 'printing' || job.status === 'printed'
    //       ? 'positive'
    //       : 'negative';
    //   Notify.create({
    //     type,
    //     message: `Arquivo ${job.title} enviado para impressora...`,
    //     position: 'top-right',
    //   });
    //   app.spools.push(job);
    // });

    setTimeout(() => {
      app.spools = [];
    }, 15000);

    if (call) call(jobs);
  });
}

export { socket };
