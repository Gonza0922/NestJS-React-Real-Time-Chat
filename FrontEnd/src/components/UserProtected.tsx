import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

function UserProtected() {
  const { isAuthenticated } = useUserContext();

  if (!isAuthenticated) return <Navigate to={"/login"} replace />;

  return (
    <>
      <Outlet />
    </>
  );
}

export default UserProtected;
