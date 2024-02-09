<template>
  <div v-if="!props.connected" class="card red darken-1 offline">
    <div class="card-content white-text">
      <span class="card-title">Servidor offline</span>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ connected: boolean }>();
</script>
<style>
.card .card-content {
  padding: 10px !important;
}

.offline {
  position: fixed !important;
  margin: 0px !important;
  padding: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0.4;
}
</style>
