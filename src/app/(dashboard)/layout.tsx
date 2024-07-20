import Navbar from "@/components/dashboard/Navbar";
import SideBar from "@/components/dashboard/SideBar";
import React from "react";


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* <Navbar /> */}
      {/* {children} */}

      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[230px_1fr] relative ">
        <SideBar />
        <div className="flex flex-col w-full">
          {/* NAVBAR */}
          <Navbar />
          {/* MAIN SECTION */}
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
