<!-- eslint-disable no-console -->
<template>
  <div v-if="desserts.length > 0" class="spool" @click="click">
    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
      hide-default-header
      hide-default-footer
      loading
    ></v-data-table>
    {{ messageRxd }}
  </div>
</template>

<script>
import { io } from 'socket.io-client';

const socket = io('http://localhost:3010');

export default {
  name: 'SpoolsComponents',
  data() {
    return {
      messageRxd: '...',
      headers: [
        // {
        //   text: 'Usuário',
        //   align: 'start',
        //   sortable: false,
        //   value: 'user',
        // },
        { text: 'Impressora', value: 'printer' },
        { text: 'Arquivo', value: 'filename' },
        { text: 'Status', value: 'status' },
      ],
      desserts: [],
    };
  },
  mounted() {
    this.update();
    socket.on('msg', (message) => {
      console.log('Msg: ', message);
      this.messageRxd = message;
    });
  },
  methods: {
    click() {},
    async update() {
      const { data } = await this.$axios.$post('/api/printers/spools');
      this.desserts = data.map((el) => {
        el.data.status = `${el.data.status || ''} ${el.data.description || ''}`;
        return el.data;
      });
    },
  },
};
</script>

<style>
.v-application .primary {
  background-color: #4caf50 !important;
  border-color: #4caf50 !important;
}

.spool {
  padding: 30px 40px;
}
</style>
