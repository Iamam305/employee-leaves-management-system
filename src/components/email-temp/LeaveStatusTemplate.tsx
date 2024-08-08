import React from "react";

interface LeaveStatusTemplateProps {
  employeeName: string;
  leaveStartDate: string;
  leaveEndDate: string;
  leaveReason: string;
  StatusOfLeave:string
}

export const LeaveStatusEmail: React.FC<Readonly<LeaveStatusTemplateProps>> = ({
  employeeName,
  leaveStartDate,
  leaveEndDate,
  leaveReason,
  StatusOfLeave,
}) => {
//   const leaveRequestLink = `${process.env.APP_URL}/approve-leave?email=${managerEmail}`;

  return (
    <div>
      <p>
        Dear Employee,
      </p>
      <p>
        Your Leave has been {StatusOfLeave}
      </p>
      <p>
        <strong>Employee Name:</strong> {employeeName}
      </p>
      <p>
        <strong>Leave Start Date:</strong> {leaveStartDate}
      </p>
      <p>
        <strong>Leave End Date:</strong> {leaveEndDate}
      </p>
      <p>
        <strong>Reason for Leave:</strong> {leaveReason}
      </p>
      <p>
        Please review and approve the leave request 
      </p>
      <p>
        Thank you.
      </p>
    </div>
  );
};
