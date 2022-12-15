<template>
  <div v-if="desserts.length > 0">
    <h3>
      Fila de impressão:
      <v-progress-circular
        indeterminate
        color="green"
        :size="30"
      ></v-progress-circular>
      <br />
    </h3>
    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
      hide-default-header
      hide-default-footer
    ></v-data-table>
    <br />
    <br />
    <h3>Nova impressão:</h3>
  </div>
</template>

<script>
export default {
  name: 'SpoolsComponents',
  data() {
    return {
      headers: [
        // {
        //   text: 'Usuário',
        //   align: 'start',
        //   sortable: false,
        //   value: 'user',
        // },
        { text: 'Impressora', value: 'printer' },
        { text: 'Arquivo', value: 'filename' },
      ],
      desserts: [],
    };
  },
  mounted() {
    setInterval(this.update, 3000);
  },
  methods: {
    async update() {
      const { data } = await this.$axios.$post('/api/printers/spools');
      this.desserts = data.map((el) => el.data);
    },
  },
};
</script>

<style>
.v-progress-circular {
}
</style>
