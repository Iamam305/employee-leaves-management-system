import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data }: any) => {
  const chartData = {
    labels: data.map((item: any) => item.name),
    datasets: [
      {
        label: "Count per Month",
        data: data.map((item: any) => item.count_per_month),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 1,
        fill: true,
      },
    ],
  };

  const options: any = {
    plugins: {
      title: {
        display: true,
        text: "Leave Types Count per Month",
      },
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `Count: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Leave Type",
        },
      },
      y: {
        title: {
          display: true,
          text: "Count per Month",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className=" w-full h-full mx-auto">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
