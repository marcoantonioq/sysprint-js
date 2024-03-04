import { reactive } from 'vue';
import { Printer } from './app';

export const runtime = reactive({
  connected: navigator.onLine,
  loading: false,
  admin: true,
  selected: null as Printer | null,
});

function updateOnlineStatus() {
  console.log('Estado atual: ', navigator.onLine);
  runtime.connected = navigator.onLine;
}

console.log('Atualizando...');
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
