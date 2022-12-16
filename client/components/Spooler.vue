<template>
  <div v-if="desserts.length > 0" class="spool">
    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
      hide-default-header
      hide-default-footer
      loading
    ></v-data-table>
  </div>
</template>

<script>
export default {
  name: 'SpoolsComponents',
  data() {
    return {
      messageRxd: '',
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
    // setInterval(this.update, 10000);
    this.update();
    this.socket = this.$nuxtSocket({
      name: 'home',
    });
    this.$on('teste', (msg) => {
      console.log('Recebido Teste: ', msg);
    });
  },
  methods: {
    async update() {
      const { data } = await this.$axios.$post('/api/printers/spools');
      this.desserts = data.map((el) => {
        el.data.status = `${el.data.status || ''} ${el.data.description || ''}`;
        console.log(el.data);
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
