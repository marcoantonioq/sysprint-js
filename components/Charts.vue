<template>
  <v-row class="justify-center pt-6 pb-2">
    <div>
      <highchart :options="chartOptions" />
    </div>
  </v-row>
</template>

<script>
export default {
  name: 'ChartsComponents',
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