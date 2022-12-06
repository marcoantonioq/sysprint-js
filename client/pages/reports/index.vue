<template>
  <v-row>
    <!-- <Charts /> -->
    <!-- <ag-grid-vue
      id="myGrid"
      style="width: 100%; height: 700px"
      class="ag-theme-balham"
      :column-defs="columnDefs"
      :default-col-def="defaultColDef"
      :row-data="rowData"
    >
    </ag-grid-vue> -->
  </v-row>
</template>

<script>
// import { AgGridVue } from 'ag-grid-vue';
export default {
  name: 'ReportsPage',
  // components: {
  //   AgGridVue,
  // },
  middleware: 'protected',
  data() {
    return {
      rowData: [
        { make: 'ADM', user: 'user', model: 'HP', price: 35000 },
        { make: 'CORDI', user: '1934155', model: 'HP', price: 32000 },
        { make: 'CERTIFICADOS', user: 'user', model: 'HP', price: 72000 },
      ],
      columnDefs: [
        { headerName: 'Impressora', field: 'make' },
        { headerName: 'Usuário', field: 'user' },
        { headerName: 'Modelo', field: 'model' },
        { headerName: 'Impressões', field: 'price' },
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
// @import '../node_modules/ag-grid-community/dist/styles/ag-grid.css';
// @import '../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css';
</style>