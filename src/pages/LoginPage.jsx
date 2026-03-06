import { useState } from "react";
import { useLoginMutation } from "../app/api/baseApi";

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        <h1>Login</h1>
        <span className="auth-title-line" />
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          </label>
          <label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" disabled={isLoading}>{isLoading ? "Kirilmoqda..." : "Login"}</button>
        </form>
      </div>
    </main>
  );
}
