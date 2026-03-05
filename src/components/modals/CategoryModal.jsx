export function CategoryModal({ open, loading, name, setName, onSubmit, onClose, error, categories }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Yangi kategoriya qo'shish</h3>
        <form className="modal-form" onSubmit={onSubmit}>
          <label>
            Kategoriya nomi
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ichimlik, Mevalar..." required />
          </label>
          <p className="hint">Mavjud kategoriyalar: {categories.map((c) => c.name).join(", ") || "yo'q"}</p>
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
