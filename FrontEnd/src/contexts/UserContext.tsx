import { useState, useEffect, createContext, useContext } from "react";
import {
  registerUserRequest,
  loginUserRequest,
  logoutUserRequest,
  verifyTokenUserRequest,
} from "../api/auth.api";
import { ChildrenType, LoginData, RegisterData } from "../interfaces/user.interfaces";

const userContext = createContext<any>(undefined);

export function useUserContext() {
  return useContext(userContext);
}

const UserProvider = (props: ChildrenType) => {
  const [user, setUser] = useState<object>({});
  const [error, setError] = useState<object[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [updateProfile, setUpdateProfile] = useState({});
  const [isMembers, setIsMembers] = useState({});

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
      setUser(data.user);
      setIsAuthenticated(true);
      console.log(data);
      sessionStorage.setItem("token", data.token);
    } catch (error: any) {
      console.log(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
    }
  };

  const signUp = async (user: RegisterData) => {
    try {
      const data = await registerUserRequest(user);
      setUser(data.user);
      setIsAuthenticated(true);
      console.log(data);
      sessionStorage.setItem("token", data.token);
    } catch (error: any) {
      console.log(error);
      const e = error.response.data;
      e.message ? setError(e.message) : setError(e.error);
    }
  };

  const logout = async () => {
    try {
      await logoutUserRequest();
      setUser({});
      setIsAuthenticated(false);
      sessionStorage.removeItem("token");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const verify = async () => {
      const session = sessionStorage.getItem("token");
      if (!session) return setIsAuthenticated(false);
      try {
        const property = await verifyTokenUserRequest();
        setUser(property);
        setIsAuthenticated(true);
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
        updateProfile,
        setUpdateProfile,
        isMembers,
        setIsMembers,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserProvider;
