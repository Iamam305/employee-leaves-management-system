import axios from "axios";

export const LoginUser = (user: { email: string; password: string }) => {
    const { email, password } = user;
    try {
      const respone = axios.post("/api/login", {
        email,
        password,
      });
      return respone;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };