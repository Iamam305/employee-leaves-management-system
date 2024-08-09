"use client";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { LeavetypeInterface } from "@/lib/type";
import { Description } from "@radix-ui/react-dialog";
import React, { useState } from "react";

const truncateText = (text: any, length: number) => {
  const str = text ? String(text) : "";
  return str.length <= length ? str : str.substring(0, length) + "...";
};

const LeaveModal: React.FC<{
  title: string;
  // accessorKey: keyof LeavetypeInterface;
  // row: LeavetypeInterface;
}> = ({ title}) => {
  const [isOpen, setIsOpen] = useState(false);

  // const getData = () => {
  //   const data = row[accessorKey];
  //   return Array.isArray(data) ? data : [data];
  // };

  // const truncatedText = (() => {
  //   if (accessorKey === "user_id") {
  //     return truncateText(
  //       row[accessorKey]?.name ||
  //         "N/A",
  //       10
  //     );
  //   }
  //   if (accessorKey === "leave_type_id") {
  //     return truncateText(
  //       row[accessorKey]?.name ||
  //         "N/A",
  //       10
  //     );
  //   }
  //   return truncateText(row[accessorKey] || "N/A", 10);
  // })();

  return (
    <>
      <span
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      >{title}
        {/* {truncatedText && truncatedText !== "N/A" ? "View" : "N/A"} */}
      </span>
      {/* {truncatedText !== "N/A" && ( */}
        <>
          <Modal
            title={title}
            description={`Detailed view of ${title}`}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            {/* <div className="p-4"> */}
            <div className="p-4 max-h-[60vh]  overflow-y-auto">
              {/* {accessorKey === "agent_actions" ? (
                <ul className="list-none pl-5">
                  {row[accessorKey]?.map((action) => (
                    <Card className=" mt-3 p-3">
                      <li key={action._id}>
                        <strong>Action:</strong> {action.action} <br />
                        <strong>Timestamp:</strong> {action.timestamp}
                      </li>
                    </Card>
                  ))}
                </ul>
              ) : accessorKey === "product_analysis" ? (
                <ul className="list-none pl-5">
                  {row[accessorKey]?.map((item, index) => (
                    <Card className=" mt-3 p-3">
                      <li key={index}>
                        <strong>Correct Answer:</strong> {item.correct_answer}{" "}
                        <br />
                        <strong>Is Correct:</strong>{" "}
                        {item.is_correct ? "Yes" : "No"} <br />
                        <strong>Similarity:</strong> {item.similarity} <br />
                        <strong>Info is in Context:</strong>{" "}
                        {item.info_is_in_context ? "Yes" : "No"}
                      </li>
                    </Card>
                  ))}
                </ul>
              ) : accessorKey === "parameter_analysis" ? (
                <>
                  <ul className="list-none pl-5">
                    {row[accessorKey]?.map((item, index) => (
                      <Card className=" mt-3 p-3">
                        <li key={index}>
                          <strong>Parameter Name:</strong> {item.parameter_name}{" "}
                          <br />
                          <strong>Area Of Improvement</strong>{" "}
                          {item.area_of_improvement} <br />
                          <strong>Criteria Description</strong>
                          {item.criteria_description} <br />
                          <strong>Followed:</strong>
                          {item.followed ? "True" : "False"} <br />
                        </li>
                      </Card>
                    ))}
                  </ul>
                </>
              ) : (
                <ul className="list-disc pl-5">
                  {getData().map((item, index) => (
                    <li key={index}>
                      {typeof item === "object" && item !== null ? (
                        <div>
                          {Object.entries(item).map(([subKey, subValue]) => (
                            <div key={subKey}>
                              <strong>{subKey}:</strong> {subValue}
                            </div>
                          ))}
                        </div>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              )} */}
              Leave Modal
            </div>
          </Modal>
        </>
      {/* )} */}
    </>
  );
};

export default LeaveModal;
