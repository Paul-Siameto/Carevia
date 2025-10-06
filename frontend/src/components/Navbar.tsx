import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">Carevia</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <NavLink to="/" className={({isActive})=> isActive?"underline":""}>Dashboard</NavLink>
              <NavLink to="/health" className={({isActive})=> isActive?"underline":""}>Health</NavLink>
              <NavLink to="/mood" className={({isActive})=> isActive?"underline":""}>Mood</NavLink>
              <NavLink to="/articles" className={({isActive})=> isActive?"underline":""}>Articles</NavLink>
              <NavLink to="/ai" className={({isActive})=> isActive?"underline":""}>AI</NavLink>
              <NavLink to="/profile" className={({isActive})=> isActive?"underline":""}>Profile</NavLink>
              <NavLink to="/privacy" className={({isActive})=> isActive?"underline":""}>Privacy</NavLink>
              <button className="ml-2 bg-white text-primary px-3 py-1 rounded" onClick={()=>{ logout(); navigate('/login'); }}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive})=> isActive?"underline":""}>Login</NavLink>
              <NavLink to="/register" className={({isActive})=> isActive?"underline":""}>Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



