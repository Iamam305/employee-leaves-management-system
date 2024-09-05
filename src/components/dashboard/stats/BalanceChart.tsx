import React from "react";
import { Bar } from "react-chartjs-2";

const BalanceChart = ({ balances }: any) => {
  if (!balances || balances.length === 0 || !balances[0].leaveBalances) {
    return <p>No data available</p>;
  }

  const leaveBalances = balances[0].leaveBalances;

  const leaveTypes = Object.keys(leaveBalances);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // const months = Object.keys(leaveBalances[leaveTypes[0]]?.monthly).map(
  //   (month) => {
  //     const monthIndex = parseInt(month);
  //     return monthNames[monthIndex];
  //   }
  // );

  const months = leaveBalances[leaveTypes[0]]?.monthly
  ? Object.keys(leaveBalances[leaveTypes[0]]?.monthly).map((month) => {
      const monthIndex = parseInt(month);
      return monthNames[monthIndex];
    })
  : [];


  const colors = [
    "rgba(255, 99, 132, 1)", 
    "rgba(54, 162, 235, 1)",  
    "rgba(255, 206, 86, 1)",  
    "rgba(75, 192, 192, 1)",  
    "rgba(153, 102, 255, 1)", 
    "rgba(255, 159, 64, 1)",
    "rgba(199, 199, 199, 1)", 
  ];

  const datasets = leaveTypes.map((leaveType, index) => {
    const monthlyData = leaveBalances[leaveType].monthly;
    return {
      label: `${leaveType} Leave Available`,
      data: Object.values(monthlyData).map((data: any) => data.available),
      borderColor: colors[index % colors.length], 
      backgroundColor: colors[index % colors.length].replace('1)', '0.2)'),
      fill: true,
    };
  });

  const data = {
    labels: months,
    datasets: datasets,
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Available Balance History',
      },
    },
  };

  return (
    <div className=" w-full h-full mx-auto">

      <Bar data={data} options={options} />
    </div>
  );
};

export default BalanceChart;
