<template>
  <div class="row flex-center">
    <div
      class="printer column items-center q-ma-lg"
      v-for="printer in props.printers"
      :key="printer.name"
      @click="selected(printer)"
    >
      <q-icon
        class="icon"
        color="primary"
        name="print"
        style="font-size: 5em"
      />
      <b> {{ printer.name.toUpperCase().replace(/(_|-)/gi, ' ') }}</b>
      <div style="display: none" :class="{'pause': !!printer.info }">
        pause...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Printer } from 'src/app';

const props = defineProps<{ printers: Printer[] }>();

const emit = defineEmits<{
  selected: [printer: Printer];
}>();

const selected = (printer: Printer) => {
  emit('selected', printer);
};
</script>

<style scoped lang="scss">
.printer {
  min-width: 200px;
  cursor: pointer;
  padding: 10px;
  transition: transform 0.5s ease-in-out;
}

.printer:hover {
  .icon {
    animation: shake 0.5s ease-in-out;
  }
}

@keyframes shake {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(6deg);
  }
  50% {
    transform: rotate(0eg);
  }
  75% {
    transform: rotate(-6deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.pause {
  display: block !important;

}
</style>
