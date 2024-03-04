<template>
  <div class="offline-indicator q-pa-sm text-center" v-if="!runtime.connected">
    <q-icon name="wifi_off" color="red" size="150px" />
    <p>Verifique sua conexão com o servidor ou procure o suporte técnico.</p>
  </div>
</template>

<script setup lang="ts">
import { app } from 'src/app';
import { runtime } from 'src/runtime';
</script>

<style lang="scss" scoped>
.offline-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 20px;
}
</style>
