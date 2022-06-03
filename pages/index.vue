<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <Printers />
    </v-col>
  </v-row>
</template>

<script>
import Printers from '../components/Printers.vue';
export default {
  auth: false,
  name: 'Inicial',
  middleware: ['auth', 'printers'],
  components: { Printers },
  mounted() {
    console.log(this.$dayjs().format());
  },
};
</script>

<style>
* {
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
