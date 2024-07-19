import Register from "@/components/Auth/Register";

const Page = () => {
  return (
    <div className="w-full flex" style={{ height: "calc(100vh )" }}>
      {/** Left Section **/}
      <div className="md:w-[45%] h-full bg-zinc-900 p-6 relative hidden md:block">
        <h1 className="text-white font-semibold text-xl">
          Employee Management System
        </h1>
        <div className="absolute bottom-10">
          <h1 className="text-white font-semibold text-xl">Welcome Back!</h1>
        </div>
      </div>
      {/** Right Section **/}
      <Register />
    </div>
  );
};

export default Page;
