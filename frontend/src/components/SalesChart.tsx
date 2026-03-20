import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

import { Bar } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type Props = {
  labels: string[]
  values: number[]
}

export function SalesChart({ labels, values }: Props) {

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: values
      }
    ]
  }

  return (
    <div style={{ width: "600px", marginTop: "30px" }}>
      <Bar data={data} />
    </div>
  )
}