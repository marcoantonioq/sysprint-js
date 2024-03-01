import { reactive } from 'vue';

export interface Printer {
  name: string;
  location: string;
  description: string;
  model: string;
  driver: string;
  status: string;
  info: string;
}

export interface Spool {
  id: number;
  user: string;
  print: string;
  title?: string;
  copies?: number;
  printed?: number;
  range?: string;
  pages?: 'all' | 'odd' | 'even';
  sided?: 'one-sided' | 'two-sided-long-edge' | 'two-sided-short-edge';
  media?: 'letter' | 'A3' | 'A4' | 'A5' | 'legal' | 'envelope' | 'photo';
  orientation?: '3' | '4' | '5' | '6' | 'N' | undefined;
  quality?: '3' | '4' | '5';
  buffer?: Buffer;
  path?: string;
  status?: 'send' | 'printing' | 'printed' | 'cancel';
  msgs: string[];
  errors: string[];
}

export interface PageLog {
  print: string;
  user: string;
  job: string;
  time: string;
  pages: string;
  copies: string;
  'job-billing': string;
  'job-originating-host-name': string;
  'job-name': string;
  media: string;
  sides: string;
}

export interface App {
  spools: Spool[];
  printers: Printer[];
  system: {
    rebooting: boolean;
    saving: boolean;
    token: string;
    port: string;
  };
  auth: {
    enable: boolean;
    ad: {
      url: string;
      baseDN: string;
      username: string;
      password: string;
    };
  };
}

export const app = reactive<App>({
  spools: [] as Spool[],
  printers: [] as Printer[],
  system: {
    rebooting: false,
    saving: false,
    token: '',
    port: '3000',
  },
  auth: {
    enable: true,
    ad: {
      url: 'ldap://10.11.0.16',
      baseDN: 'dc=ifg,dc=br',
      username: '1934155',
      password: '',
    },
  },
});
