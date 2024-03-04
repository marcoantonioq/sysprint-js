<template>
  <div
    class="offline-indicator"
    v-if="!runtime.connected || runtime.app.printers"
  >
    <q-icon name="wifi_off" color="red" size="150px" />
    <p>Você está offline!</p>
    <p>Verifique sua conexão com a internet ou procure o suporte técnico.</p>
  </div>
</template>

<script setup lang="ts">
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
