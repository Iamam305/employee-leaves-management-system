import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { TbListCheck } from "react-icons/tb";
import { BsCalendar4Event } from "react-icons/bs";
import { MdOutlineBalance } from "react-icons/md";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";
import { createElement } from "react";
import { Skeleton } from "../ui/skeleton";

const UserStatsCard = ({
  totalLeaves,
  totalPendingLeaves,
  totalAcceptedLeaves,
  totalRejectedLeaves,
  loading,
}: any) => {
  const UserStatsCardData = [
    {
      key: "leave",
      title: "Total Leaves",
      value: totalLeaves,
      icon: TbListCheck,
    },
    {
      key: "user",
      title: "Accepted Leaves",
      value: totalAcceptedLeaves,
      icon: HiOutlineUserGroup,
    },
    {
      key: "event",
      title: "Rejected Leaves",
      value: totalRejectedLeaves,
      icon: BsCalendar4Event,
    },
    {
      key: "balance",
      title: "Balance Left",
      value: 20,
      icon: MdOutlineBalance,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 w-full">
      {UserStatsCardData.map((stat) => (
        <>
          {loading ? (
            <Skeleton className="h-[15vh] flex flex-row items-center justify-between space-y-0 pb-2" />
          ) : (
            <Card key={stat.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {createElement(stat.icon, {
                  size: 24,
                })}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )}
        </>
      ))}
    </div>
  );
};

export default UserStatsCard;
