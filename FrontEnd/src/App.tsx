import { BrowserRouter, Route, Routes } from "react-router-dom";
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
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<UserProtected />}>
              <Route path="/users/undefined" element={<h1>I got you Hacker</h1>} />
              <Route index element={<Chat />} />
              <Route path="/users/:name" element={<Chat />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </UserProvider>
  );
}

export default App;
