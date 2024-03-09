import {
  Chart,
  BarController,
  DoughnutController,
  ArcElement,
  PieController,
  LineController,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Colors,
  Tooltip,
  PointElement,
} from 'chart.js'

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Colors,
  Tooltip,
  DoughnutController,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
)

export default Chart
