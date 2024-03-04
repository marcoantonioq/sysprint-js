import { Notify } from 'quasar';
import { boot } from 'quasar/wrappers';
import { Socket, io } from 'socket.io-client';
import { Spool, app } from 'src/app';
import { runtime } from 'src/runtime';

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
  socket?.emit('sendPrint', jobs, (jobs: Spool[]) => {
    jobs.forEach((e) => {
      const type =
        e.status === 'printing' || e.status === 'printed'
          ? 'positive'
          : 'negative';
      Notify.create({
        type,
        message: `Arquivo ${e.title} enviado para impressora...`,
        position: 'top-right',
      });
      app.spools.push(e);
      setTimeout(() => {
        app.spools = [];
      }, 15000);
    });

    if (call) call(jobs);
  });
}

export { socket };
