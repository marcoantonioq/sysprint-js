<template>
  <div v-if="!runtime.connected" class="message">
    <q-icon name="wifi_off" color="red" size="150px" />
    <p>
      Verifique sua conexão com o servidor de impressão ou procure o suporte
      técnico.
    </p>
  </div>
  <div v-else-if="app.printers.length === 0" class="message">
    <q-icon name="power_off" color="red" size="150px" />
    Nenhuma impressora
  </div>
</template>

<script setup lang="ts">
import { app } from 'src/app';
import { runtime } from 'src/runtime';
</script>

<style scoped>
.message {
  height: 100vh;
  font-size: 20px;
  margin: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
