import ForgetPassword from "@/components/Auth/ForgetPassword";
import React from "react";

const page = () => {
  return (
    <>
      <div className=" w-full  flex " style={{ height: "calc(100vh)" }}>
        {/* Left Section */}
        <div className="md:w-[45%] h-full bg-zinc-900 p-6 relative hidden md:block">
          <h1 className="text-white font-semibold text-xl ">
            MW Leaves Management System
          </h1>
          <div className=" absolute bottom-10 ">
            <h1 className="text-white font-semibold text-xl ">
              Welcome Back!{" "}
            </h1>
          </div>
        </div>
        <div className="md:w-[55%] w-[100%] h-full  flex items-center justify-center">
          <ForgetPassword />
        </div>
      </div>
    </>
  );
};

export default page;
