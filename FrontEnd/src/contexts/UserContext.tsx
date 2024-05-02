import { useState, useEffect, createContext, useContext } from "react";
import { registerUserRequest, loginUserRequest, logoutUserRequest } from "../api/auth.api";
import { ChildrenType, LoginData, RegisterData } from "../interfaces/user.interfaces";
import { getUserPasswordRequest } from "../api/users.api";

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
      sessionStorage.setItem("token", data.password);
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
      sessionStorage.setItem("token", data.password);
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
      if (session.length !== 60) return setIsAuthenticated(false);
      try {
        const property = await getUserPasswordRequest(session);
        setUser({ ...user, name: property.name });
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
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserProvider;
