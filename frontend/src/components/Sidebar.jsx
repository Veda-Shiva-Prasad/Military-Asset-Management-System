import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">MAMS</div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>

        {(user?.role === "ADMIN" ||
          user?.role === "BASE_COMMANDER" ||
          user?.role === "LOGISTICS_OFFICER") && (
          <NavLink to="/purchases">Purchases</NavLink>
        )}

        {(user?.role === "ADMIN" ||
          user?.role === "BASE_COMMANDER" ||
          user?.role === "LOGISTICS_OFFICER") && (
          <NavLink to="/transfers">Transfers</NavLink>
        )}

        {(user?.role === "ADMIN" || user?.role === "BASE_COMMANDER") && (
          <NavLink to="/assignments">Assignments</NavLink>
        )}

        {(user?.role === "ADMIN" || user?.role === "BASE_COMMANDER") && (
          <NavLink to="/expenditures">Expenditures</NavLink>
        )}

        {user?.role === "ADMIN" && (
          <NavLink to="/audit-logs">Audit Logs</NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
