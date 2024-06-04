import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import UserProvider from "./contexts/UserContext";
import Register from "./pages/Register";
import UserProtected from "./components/UserProtected";
import SocketProvider from "./contexts/SocketContext";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<UserProtected />}>
            <Route element={<SocketWrapper />}>
              <Route index element={<Chat />} />
              <Route path="/users/:name" element={<Chat />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

function SocketWrapper() {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
}

export default App;
