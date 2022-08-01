<template>
  <v-row>
    <Charts />
    <ag-grid-vue
      id="myGrid"
      style="width: 100%; height: 700px"
      class="ag-theme-balham"
      :column-defs="columnDefs"
      :default-col-def="defaultColDef"
      :row-data="rowData"
    >
    </ag-grid-vue>
  </v-row>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
export default {
  name: 'ReportsPage',
  components: {
    AgGridVue,
  },
  middleware: 'protected',
  data() {
    return {
      rowData: [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 },
      ],
      columnDefs: [
        { headerName: 'Marca', field: 'make' },
        { headerName: 'Modelo', field: 'model' },
        { headerName: 'Preço', field: 'price' },
      ],
      defaultColDef: {
        sortable: true,
        filter: true,
        flex: 1,
      },
    };
  },
};
</script>


<style lang="scss">
@import '~/node_modules/ag-grid-community/dist/styles/ag-grid.css';
@import '~/node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';
</style>