<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      Encaminharemos para nova versão do sistema de impressão!
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PageHome',
  middleware: 'protected',
  created() {
    this.$router.push('/printers');
  },
};
</script>

<style>
</style>
