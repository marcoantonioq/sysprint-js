import { Notify, Loading } from 'quasar';
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

    Loading.show({
      message:
        'Enviando arquivo...<br/><span class="text-amber text-italic">Aguarde</span>',
      html: true,
    });
    setTimeout(() => {
      Loading.hide();
    }, 30000);
    await axios.post('/api/print', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    Notify.create({
      type: 'positive',
      message: `Arquivo ${job.title} enviado para impressora...`,
      position: 'top-right',
    });
    Loading.hide();
    // app.spools.push(job);
    if (call) call(jobs);
  });
}

export { socket };
