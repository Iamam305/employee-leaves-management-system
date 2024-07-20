import Navbar from "@/components/landing-page/navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}

    </div>
  );
};

export default Layout;
