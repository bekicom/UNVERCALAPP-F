import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { token, user, login, logout } = useAuth();

  if (!token || !user) {
    return <LoginPage onLogin={login} />;
  }

  return <DashboardPage user={user} onLogout={logout} />;
}
