import * as React from "react";

interface EmailTemplateProps {
  email?: string;
  password?: string;
}

export const InviteEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  password,
}) => (
  <div>
    <pre>Email - {email}</pre>
    <pre>Passoword - {password}</pre>
  </div>
);