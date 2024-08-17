"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LeaveToolTip = ({ data }: { data: any }) => {
  if (!data || data === "N/A") {
    return <span>N/A</span>;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger>{data.substr(0,13)}</TooltipTrigger>
        <TooltipContent className="p-2">
          <p>{data}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LeaveToolTip;
