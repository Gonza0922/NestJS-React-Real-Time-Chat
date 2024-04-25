import { useState, useEffect, createContext, useContext } from "react";
import {
  registerUserRequest,
  loginUserRequest,
  logoutUserRequest,
  verifyTokenUserRequest,
} from "../api/auth.api";
import Cookie from "js-cookie";
import { ChildrenType, LoginData, RegisterData } from "../interfaces/user.interface";

const userContext = createContext<any>(undefined);

export function useUserContext() {
  return useContext(userContext);
}

const UserProvider = (props: ChildrenType) => {
  const [user, setUser] = useState<object>({});
  const [error, setError] = useState<object[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => {
        setError([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const login = async (user: LoginData) => {
    try {
      const data = await loginUserRequest(user);
      setUser(data);
      setIsAuthenticated(true);
      console.log(data);
    } catch (error: any) {
      console.log(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
    }
  };

  const signUp = async (user: RegisterData) => {
    try {
      const data = await registerUserRequest(user);
      setUser(data);
      setIsAuthenticated(true);
      console.log(data);
    } catch (error: any) {
      console.log(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
    }
  };

  const logout = async () => {
    try {
      await logoutUserRequest();
      Cookie.remove("token");
      setUser({});
      setIsAuthenticated(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const verify = async () => {
      const cookies = Cookie.get();
      if (!cookies.UserToken) return setIsAuthenticated(false);
      try {
        const user = await verifyTokenUserRequest();
        console.log(user);
        if (!user) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(user);
      } catch (error) {
        setIsAuthenticated(false);
        console.log(error);
      }
    };
    verify();
  }, []);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        signUp,
        login,
        logout,
        isAuthenticated,
        error,
        setError,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserProvider;
