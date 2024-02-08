<template>
  <div class="flex">
    <div v-show="!app.printers || !app.printers.length">
      Nenhum impressora encontrada
    </div>
    <ModalPrinters
      :printer="printer"
      v-for="printer in app.printers"
      :key="printer.name"
      @send="addSpool"
    />
  </div>
  <ServerOffline :connected="app.server.connected" />
</template>

<script lang="ts" setup>
import { app, print, DataPrinter } from "./store";
import ModalPrinters from "./components/ModalPrinters.vue";
import ServerOffline from "./components/ServerOffline.vue";

async function addSpool(payload: DataPrinter) {
  const data = await print(payload.spool);
  data.forEach((spool) => {
    app.spools.push(spool);
  });
}
</script>

<style lang="scss">
html,
body {
  height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 10px;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}
</style>
