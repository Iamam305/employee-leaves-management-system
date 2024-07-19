import React from "react";

interface EmailTemplateProps {
  code?: string;
  userId?: string;
}

export const EmailVerification: React.FC<Readonly<EmailTemplateProps>> = ({
  code,
  userId,
}) => {
  const verificationLink = `${process.env.APP_URL}/verify-mail?userId=${userId}`;
  return (
    <div>
      <p>
        Your verification code is: <strong>{code}</strong>
      </p>
      <p>
        Click the link below to verify your email:
        <br />
        <a href={verificationLink} target="_blank" rel="noopener noreferrer">
          Verify your email
        </a>
      </p>
    </div>
  );
};
