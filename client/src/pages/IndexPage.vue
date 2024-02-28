<template>
  <q-page>
    <ListPrintersComponent
      :printers="app.printers"
      @selected="runtime.selected = $event"
    />
    <PrinterComponent
      :printer="runtime.selected"
      @cancel="runtime.selected = null"
    />
    <ListSpoolsComponent :spools="app.spools" />
  </q-page>
</template>

<script setup lang="ts">
import { app } from 'src/app';
import ListPrintersComponent from 'src/components/ListPrintersComponent.vue';
import ListSpoolsComponent from 'src/components/ListSpoolsComponent.vue';
import PrinterComponent from 'src/components/PrinterComponent.vue';
import { runtime } from 'src/runtime';
</script>
