import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Providers from "./components/Providers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Health from "./pages/Health";
import Mood from "./pages/Mood";
import Articles from "./pages/Articles";
import AI from "./pages/AI";
import Privacy from "./pages/Privacy";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <Providers>
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}> 
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/health" element={<Health />} />
              <Route path="/mood" element={<Mood />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Providers>
  );
}

export default App;



