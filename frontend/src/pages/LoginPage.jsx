import { useState } from "react";
import { useLoginMutation } from "../app/api/baseApi";

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("0000");
  const [error, setError] = useState("");
  const [loginMutation, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginMutation({ username, password }).unwrap();
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="badge">UY-DOKON</p>
        <h1>Admin Login</h1>
        <p className="hint">Demo login: admin / 0000</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Login<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" /></label>
          <label>Parol<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="0000" /></label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" disabled={isLoading}>{isLoading ? "Kirilmoqda..." : "Kirish"}</button>
        </form>
      </div>
    </main>
  );
}
