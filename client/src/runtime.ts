import { reactive } from 'vue';
import { App, Printer } from './app';

export const runtime = reactive({
  connected: false,
  loading: false,
  admin: true,
  app: <App>{},
  selected: null as Printer | null,
});
