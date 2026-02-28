export function SupplierModal({ open, loading, form, setForm, onSubmit, onClose, error }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{form.id ? "Yetkazib beruvchini tahrirlash" : "Yangi yetkazib beruvchi"}</h3>
        <form className="modal-form" onSubmit={onSubmit}>
          <label>
            Nomi
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </label>
          <label>
            Manzili
            <input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          </label>
          <label>
            Telefon
            <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
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
