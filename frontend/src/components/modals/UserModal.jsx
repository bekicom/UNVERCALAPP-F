export function UserModal({ open, loading, form, setForm, onSubmit, onClose, error }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{form.id ? "Xodimni tahrirlash" : "Yangi xodim"}</h3>
        <form className="modal-form" onSubmit={onSubmit}>
          <label>
            Login (username)
            <input
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              placeholder="kassir1"
              required
            />
          </label>
          <label>
            Rol
            <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
              <option value="admin">Admin</option>
              <option value="cashier">Kassir</option>
            </select>
          </label>
          <label>
            {form.id ? "Yangi parol (ixtiyoriy)" : "Parol"}
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder={form.id ? "O'zgartirmaslik uchun bo'sh qoldiring" : "kamida 4 belgi"}
              required={!form.id}
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>Bekor qilish</button>
            <button type="submit" disabled={loading}>{loading ? "Saqlanmoqda..." : "Saqlash"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
