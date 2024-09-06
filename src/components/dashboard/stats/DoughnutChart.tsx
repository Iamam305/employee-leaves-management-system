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
  ArcElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DoughnutChart = ({ data, title }: any) => {
  const dummyData = [
    { _id: "approved", count: 75 },
    { _id: "pending", count: 80 },
    { _id: "rejected", count: 85 },
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
    // scales: {
    //   x: {
    //     ticks: {
    //       maxTicksLimit: 10,
    //     },
    //     barPercentage: 0.5,
    //     categoryPercentage: 0.5,
    //     grid: {
    //       display: false, // Disable grid lines on the x-axis
    //     },
    //   },
    //   y: {
    //     beginAtZero: true,
    //     grid: {
    //       display: false, // Disable grid lines on the y-axis
    //     },
    //   },
    // },
    // };
    // scales: {
    //   x: {
    //     ticks: {
    //       maxTicksLimit: 6,
    //     },
    //     barPercentage: 0.1,
    //     categoryPercentage: 0.5,
    //   },
    //   y: {
    //     beginAtZero: true,
    //   },
    // },
  };

  const chart_data = {
    labels: (data || dummyData).map((item: any) => item._id),
    datasets: [
      {
        label: title,
        data: (data || dummyData).map((item: any) => item.count),
        backgroundColor: [
          "rgba(13, 213, 213, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(172, 18, 52, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          // "#d7113c",
          "rgba(255, 206, 86, 1)",
          "rgba(172, 18, 52, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full h-[300px] mx-auto  flex items-center justify-center mb-10">
      <Doughnut data={chart_data} options={options} />
    </div>
  );
};

export default DoughnutChart;
