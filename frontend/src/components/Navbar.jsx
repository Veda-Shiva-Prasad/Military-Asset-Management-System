import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-title">Military Asset Management</div>

      <div className="navbar-right">
        <span>
          {user?.name} ({user?.role})
        </span>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
