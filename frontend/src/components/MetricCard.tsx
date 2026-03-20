import "./MetricCard.css"

type Props = {
  title: string
  value: string | number
}

export function MetricCard({ title, value }: Props) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  )
}