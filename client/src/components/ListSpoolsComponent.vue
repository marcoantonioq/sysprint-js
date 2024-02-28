<template>
  <q-footer elevated class="white" v-if="printing.length">
    <q-table
      flat
      bordered
      dense
      :rows="printing"
      hide-bottom
      :columns="columns"
    />
  </q-footer>
</template>

<script setup lang="ts">
import { Spool } from 'src/app';
import { computed, ref } from 'vue';

const props = defineProps<{ spools: Spool[] }>();
const printing = computed(() => {
  return props.spools.filter(
    (e) => e.status === 'printing' || e.status === 'send'
  );
});

const columns = ref([
  {
    name: 'id',
    field: 'id',
    label: 'ID',
    align: 'center' as 'center' | 'left' | 'right',
  },
  {
    name: 'title',
    field: 'title',
    label: 'Arquivo',
    align: 'center' as 'center' | 'left' | 'right',
  },
  {
    name: 'status',
    field: 'status',
    format: () => 'Imprimindo',
    label: 'Situação',
    align: 'center' as 'center' | 'left' | 'right',
  },
]);
</script>

<style scoped lang="scss">
.printer {
  min-width: 200px;
  cursor: pointer;
}

.white {
  background-color: white;
}
</style>
