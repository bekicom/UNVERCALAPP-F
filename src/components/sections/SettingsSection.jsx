import { Icon } from "../Icon";

export function SettingsSection({
  form,
  setForm,
  saving,
  error,
  onSave,
  onReset
}) {
  return (
    <section className="settings-shell">
      <form className="settings-wrap" onSubmit={onSave}>
        <header className="settings-head">
          <h2><Icon name="clipboard" />Sozlamalar</h2>
          <button type="submit" disabled={saving}>{saving ? "Saqlanmoqda..." : "Kutgar"}</button>
        </header>

        <section className="settings-card">
          <h3><Icon name="clipboard" />Umumiy sozlamalar</h3>
          <div className="settings-row">
            <p>Kam qolgan mahsulot chegarasi (dona)</p>
            <input
              type="number"
              min="0"
              value={form.lowStockThreshold}
              onChange={(e) => setForm((p) => ({ ...p, lowStockThreshold: e.target.value }))}
              required
            />
          </div>
          <div className="settings-row">
            <label className="settings-toggle-label">
              <input
                type="checkbox"
                checked={form.keyboardEnabled}
                onChange={(e) => setForm((p) => ({ ...p, keyboardEnabled: e.target.checked }))}
              />
              Ekran klaviaturasini yoqish bo'lim
            </label>
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={form.keyboardEnabled}
                onChange={(e) => setForm((p) => ({ ...p, keyboardEnabled: e.target.checked }))}
              />
              <span />
            </label>
          </div>
        </section>

        <section className="settings-card">
          <h3><Icon name="download" />Chek sozlamalari</h3>
          <div className="settings-field-grid">
            <label>
              Chek sarlavhasi
              <input
                value={form.receipt.title}
                onChange={(e) => setForm((p) => ({ ...p, receipt: { ...p.receipt, title: e.target.value } }))}
              />
            </label>
            <label>
              Chek pastki matni
              <input
                value={form.receipt.footer}
                onChange={(e) => setForm((p) => ({ ...p, receipt: { ...p.receipt, footer: e.target.value } }))}
              />
            </label>
            <label>
              Logo URL (ixtiyoriy)
              <input
                value={form.receipt.logoUrl}
                onChange={(e) => setForm((p) => ({ ...p, receipt: { ...p.receipt, logoUrl: e.target.value } }))}
                placeholder="https://..."
              />
            </label>
          </div>
        </section>

        {error ? <p className="error-text">{error}</p> : null}
        <div className="settings-actions">
          <button type="button" className="ghost" onClick={onReset}>Bekor qilish</button>
          <button type="submit" disabled={saving}>{saving ? "Saqlanmoqda..." : "Sozlamalarni saqlash"}</button>
        </div>
      </form>
    </section>
  );
}
