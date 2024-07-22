import React from "react";

interface ForgotPasswordEmailTemplateProps {
  code?: string;
  userId?: string;
}

export const ForgotPasswordEmailTemplate: React.FC<
  Readonly<ForgotPasswordEmailTemplateProps>
> = ({ userId }) => {
  const forgotPasswordLink = `${process.env.APP_URL}/forget-password?userId=${userId}`;
  return (
    <div>
      <pre>Forgot Password</pre>
      <a href={forgotPasswordLink}>Click here to reset password</a>
    </div>
  );
};
