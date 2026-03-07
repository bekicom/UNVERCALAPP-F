import { useEffect, useState } from "react";
import { useGetSettingsQuery } from "./app/api/baseApi";
import { TouchKeyboard } from "./components/common/TouchKeyboard";
import { DashboardPage } from "./pages/DashboardPage";
import { CashierPage } from "./pages/CashierPage";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { token, user, login, logout } = useAuth();
  const { data: settingsRes } = useGetSettingsQuery(undefined, { skip: !token });
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const keyboardEnabled = settingsRes?.settings?.keyboardEnabled !== false;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (!token || !user) {
    return (
      <>
        <LoginPage onLogin={login} />
        <TouchKeyboard enabled />
      </>
    );
  }

  if (user.role === "cashier" || user.role === "kassa") {
    return (
      <>
        <CashierPage user={user} onLogout={logout} />
        <TouchKeyboard enabled={keyboardEnabled} />
      </>
    );
  }

  return (
    <>
      <DashboardPage user={user} onLogout={logout} theme={theme} setTheme={setTheme} keyboardEnabled={keyboardEnabled} />
      <TouchKeyboard enabled={keyboardEnabled} />
    </>
  );
}
