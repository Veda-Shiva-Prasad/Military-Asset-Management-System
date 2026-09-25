import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Purchases from "./pages/Purchases";
import Transfers from "./pages/Transfers";
import Assignments from "./pages/Assignments";
import Expenditures from "./pages/Expenditures";
import AuditLogs from "./pages/AuditLogs";

const MainLayout = () => (
  <>
    <Navbar />
    <Sidebar />
    <main className="main-content">
      <Outlet />
    </main>
  </>
);

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/purchases" element={<Purchases />} />

          <Route path="/transfers" element={<Transfers />} />

          {/* Admin + Base Commander only */}
          <Route
            element={<RoleRoute allowedRoles={["ADMIN", "BASE_COMMANDER"]} />}
          >
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/expenditures" element={<Expenditures />} />
          </Route>

          {/* Admin only */}
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/audit-logs" element={<AuditLogs />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
