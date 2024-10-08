"use client";

import { login, logout } from "@/store/authSlice";
import { selectMembership, unSelectMembership } from "@/store/membershipSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect } from "react";
import { useDispatch } from "react-redux";
export const CurrentUser: any = createContext(null);

export const CurrentUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuth, setIsAuth] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const getCurrentUser = async () => {
    try {
      const res = await axios.get("/api/me");
      //   console.log("in contect====>", res);
      if (res.data) {
        dispatch(login(res.data[0].user));
        console.log("res.data===>", res.data);
        setIsAuth(true);
        if (res.data[0].membership === null) router.push("/membership");
        dispatch(selectMembership(res.data[0].membership));
      }
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      dispatch(logout());
      dispatch(unSelectMembership());
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <CurrentUser.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </CurrentUser.Provider>
  );
};

export const useCurrentUser = () => React.useContext(CurrentUser);
