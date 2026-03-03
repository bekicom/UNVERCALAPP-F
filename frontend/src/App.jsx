import { DashboardPage } from "./pages/DashboardPage";
import { CashierPage } from "./pages/CashierPage";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { token, user, login, logout } = useAuth();

  if (!token || !user) {
    return <LoginPage onLogin={login} />;
  }

  if (user.role === "cashier" || user.role === "kassa") {
    return <CashierPage user={user} onLogout={logout} />;
  }

  return <DashboardPage user={user} onLogout={logout} />;
}
