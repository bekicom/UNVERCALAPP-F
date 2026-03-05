export function ExpenseModal({
  open,
  loading,
  form,
  setForm,
  onSubmit,
  onClose,
  error,
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{form.id ? "Xarajatni edit" : "Yangi xarajat"}</h3>
        <form className="modal-form" onSubmit={onSubmit}>
          <label>
            Xarajat summasi
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) =>
                setForm((p) => ({ ...p, amount: e.target.value }))
              }
              placeholder="30000"
              required
            />
          </label>
          <label>
            Sababi
            <input
              value={form.reason}
              onChange={(e) =>
                setForm((p) => ({ ...p, reason: e.target.value }))
              }
              placeholder="Svet energiya uchun"
              required
            />
          </label>
          <label>
            Sana
            <input
              type="date"
              value={form.spentAt}
              onChange={(e) =>
                setForm((p) => ({ ...p, spentAt: e.target.value }))
              }
              required
            />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>
              Bekor qilish
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
