import React from "react";

const UsernameChangedTemplate = () => {
  const app_link = `${process.env.APP_URL}/dashboard`;
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          color: "#4E0D3A",
        }}
      >
        <h1>Your Username has been changed!</h1>
        <div style={{ margin: "20px 0", fontSize: "50px" }}>
          <span style={{ color: "#34A853" }}>✔️</span>
        </div>
      </div>
    </div>
  );
};

export default UsernameChangedTemplate;
