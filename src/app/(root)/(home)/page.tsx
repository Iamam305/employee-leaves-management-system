"use client";

import Hero from "@/components/landing-page/hero";
import { useCurrentUser } from "@/context/CurrentUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { isAuth }: any = useCurrentUser();
  // const [creatingVector, setCreatingVector] = useState(false);
  const router = useRouter();

  //not changed for demo working
  useEffect(() => {
    if (isAuth) {
      window.location.href = "/calls";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <>
      <Hero />
    </>
  );
};

export default Page;
