import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { TbListCheck } from "react-icons/tb";
import { BsCalendar4Event } from "react-icons/bs";
import { MdOutlineBalance } from "react-icons/md";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";
import { createElement } from "react";
import { useSelector } from "react-redux";

const StatsCards = ({ totalLeaves, totalPendingLeaves, totalUsers, totalBalances }: any) => {
  const selectedOrgId = useSelector((state: any) => state.organization.selectedOrg);
  const current_user_role = useSelector((state: any) => state.membership.memberShipData.role);

  // console.log("Selected Org ==> ", selectedOrgId);
  // console.log("CurrentUser ==> ", current_user_role);

  let StatsCardsData = [
    {
      key: "leave",
      title: "Total Leaves",
      change: -2,
      value: totalLeaves,
      icon: TbListCheck,
    },
    {
      key: "user",
      title: "Total Users",
      change: 4,
      value: totalUsers,
      icon: HiOutlineUserGroup,
    },
    {
      key: "event",
      title: "Pending Leaves",
      change: -20,
      value: totalPendingLeaves,
      icon: BsCalendar4Event,
    },
    {
      key: "balance",
      title: "Balances Added",
      change: 3,
      value: totalBalances,
      icon: MdOutlineBalance,
    },
  ];

  if (selectedOrgId === null && current_user_role === "admin") {
    StatsCardsData = StatsCardsData.filter((stat) => stat.key !== "balance");
  }

  const gridColumns = StatsCardsData.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'

  return (
    <div className={`grid gap-4 ${gridColumns}`}>
      {StatsCardsData.map((stat) => (
        <Card
          key={stat.key}
          className={`${
            StatsCardsData.length === 1
              ? 'col-span-full'
              : StatsCardsData.length === 2
              ? 'col-span-1'
              : 'col-span-1 lg:col-span-1'
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {createElement(stat.icon, {
              size: 24,
            })}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center">
                {stat.change > 0 ? (
                  <HiArrowNarrowUp className="text-green-600" size={16} />
                ) : (
                  <HiArrowNarrowDown className="text-red-600" size={16} />
                )}{" "}
                {stat.change}{" "}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
