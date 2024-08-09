import React from "react";

interface LeaveRequestTemplateProps {
  employeeName: string;
  leaveStartDate: string;
  leaveEndDate: string;
  leaveReason: string;
}

export const LeaveRequestEmail: React.FC<Readonly<LeaveRequestTemplateProps>> = ({
  employeeName,
  leaveStartDate,
  leaveEndDate,
  leaveReason,
}) => {
//   const leaveRequestLink = `${process.env.APP_URL}/approve-leave?email=${managerEmail}`;

  return (
    <div>
      <p>
        Dear Manager,
      </p>
      <p>
        An employee has raised a leave request. Please find the details below:
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
