import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);
import type { dataPoint } from './dataChart';

const ctx = document.getElementById('myChart') as HTMLCanvasElement;

const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Time / Angle',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {},
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },

          mode: 'xy',
        },
        pan: {
          enabled: true,
        },
      },
    },
  },
});

export function updateChart(dataPoint: dataPoint) {
  //myChart.data.labels.push(dataPoint.angle);
  myChart.data.labels?.push('');
  myChart.data.datasets[0].data.push(dataPoint.angle);

  myChart.update();
}
export default myChart;
