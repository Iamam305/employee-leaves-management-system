import { useMutation } from "react-query";
import { LoginUser } from "../actions/user.actions";

export const useUserLogin = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) => LoginUser(user),
  });
};