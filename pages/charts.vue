<template>
  <v-row class="justify-center">
    <div>
      <highchart :options="chartOptions" />
    </div>
  </v-row>
</template>

<script>
export default {
  name: 'ChartsPage',
  middleware: 'protected',
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'spline',
        },
        series: [
          {
            name: 'Valores',
            data: [1, 2, 3],
          },
        ],
        title: {
          display: true,
          text: 'Gráfico',
        },
        xAxis: {
          title: {
            text: 'Total',
          },
        },
        yAxis: {
          title: {
            text: 'Nível',
          },
        },
        credits: {
          enabled: false,
        },
      },
    };
  },
};
</script>
