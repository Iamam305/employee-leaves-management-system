import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UsersChart = ({ data, title }: any) => {
  const dummyData = [
    { date: "2024-01-01", count: 75 },
    { date: "2024-02-01", count: 80 },
    { date: "2024-03-01", count: 85 },
    { date: "2024-04-01", count: 78 },
    { date: "2024-05-01", count: 82 },
    { date: "2024-06-01", count: 88 },
    { date: "2024-07-01", count: 90 },
    { date: "2024-08-01", count: 86 },
    { date: "2024-09-01", count: 92 },
    { date: "2024-10-01", count: 89 },
  ];

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
        },
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const chart_data = {
    labels: (data || dummyData).map((item: any) =>
      new Date(item.date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      })
    ),
    datasets: [
      {
        label: title,
        data: (data || dummyData).map((item: any) => item.count),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.5,
      },
    ],
  };

  return (
    <div className="w-8/12 max-h-[400px] mx-auto">
      <Line data={chart_data} options={options} />
    </div>
  );
};

export default UsersChart;
