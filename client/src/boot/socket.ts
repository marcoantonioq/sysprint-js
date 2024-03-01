import { Notify } from 'quasar';
import { boot } from 'quasar/wrappers';
import { Socket, io } from 'socket.io-client';
import { Printer, Spool, app } from 'src/app';
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

socket?.on('job', (job: Spool) => {
  setTimeout(() => {
    console.log('Novos trabalho de impressão terminado: ', job);
    job.status = 'printed';
    app.spools = [...app.spools];
  }, 15000);

  app.spools.push(job);
});

export function sendPrinter(printer: Printer, spool: Spool, files: File[]) {
  socket?.emit(
    'sendPrint',
    printer,
    spool,
    files.map((file) => ({ filename: file.name, data: file }))
  );
  Notify.create({
    type: 'positive',
    message: 'Arquivo(s) enviado para impressora...',
    position: 'top-right',
    timeout: 15000,
  });
}

export { socket };
