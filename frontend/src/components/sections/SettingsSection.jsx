import { Icon } from "../Icon";

export function SettingsSection({
  form,
  setForm,
  saving,
  error,
  onSave,
  onReset
}) {
  const fields = form.receipt?.fields || {};
  const toggleReceiptField = (key, checked) => {
    setForm((p) => ({
      ...p,
      receipt: {
        ...p.receipt,
        fields: {
          ...(p.receipt?.fields || {}),
          [key]: checked
        }
      }
    }));
  };

  const onLogoFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setForm((p) => ({ ...p, receipt: { ...p.receipt, logoUrl: dataUrl } }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const sampleRows = [
    { name: "Coca-Cola 1.5L", qty: "2x", price: "12 000", total: "24 000" },
    { name: "Fanta 1L", qty: "1x", price: "7 500", total: "7 500" }
  ];

  return (
    <section className="settings-shell">
      <form className="settings-wrap" onSubmit={onSave}>
        

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
            <p>USD kursi (1$ = so'm)</p>
            <input
              type="number"
              min="1"
              step="0.01"
              value={form.usdRate}
              onChange={(e) => setForm((p) => ({ ...p, usdRate: e.target.value }))}
              required
            />
          </div>
          <div className="settings-row">
            <p>Dastur valyutasi</p>
            <select
              value={form.displayCurrency || "uzs"}
              onChange={(e) => setForm((p) => ({ ...p, displayCurrency: e.target.value }))}
            >
              <option value="uzs">SO'M</option>
              <option value="usd">USD</option>
            </select>
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
            <label>
              Kompyuterdan logo yuklash
              <input type="file" accept="image/*" onChange={onLogoFileChange} />
            </label>
          </div>
          <div className="settings-receipt-fields">
            <h4>Chekda ko'rinadigan maydonlar</h4>
            <div className="settings-receipt-fields-grid">
              <label><input type="checkbox" checked={fields.showDate !== false} onChange={(e) => toggleReceiptField("showDate", e.target.checked)} /> Sana</label>
              <label><input type="checkbox" checked={fields.showCashier !== false} onChange={(e) => toggleReceiptField("showCashier", e.target.checked)} /> Kassir</label>
              <label><input type="checkbox" checked={fields.showPaymentType !== false} onChange={(e) => toggleReceiptField("showPaymentType", e.target.checked)} /> To'lov turi</label>
              <label><input type="checkbox" checked={fields.showCustomer !== false} onChange={(e) => toggleReceiptField("showCustomer", e.target.checked)} /> Mijoz</label>
              <label><input type="checkbox" checked={fields.showItemsTable !== false} onChange={(e) => toggleReceiptField("showItemsTable", e.target.checked)} /> Mahsulotlar jadvali</label>
              <label><input type="checkbox" checked={fields.showItemUnitPrice !== false} onChange={(e) => toggleReceiptField("showItemUnitPrice", e.target.checked)} /> Mahsulot narxi ustuni</label>
              <label><input type="checkbox" checked={fields.showItemLineTotal !== false} onChange={(e) => toggleReceiptField("showItemLineTotal", e.target.checked)} /> Mahsulot summa ustuni</label>
              <label><input type="checkbox" checked={fields.showTotal !== false} onChange={(e) => toggleReceiptField("showTotal", e.target.checked)} /> Jami summa</label>
              <label><input type="checkbox" checked={fields.showFooter !== false} onChange={(e) => toggleReceiptField("showFooter", e.target.checked)} /> Pastki matn</label>
            </div>
          </div>
          <div className="settings-receipt-preview">
            <h4>Test chek</h4>
            <div className="receipt-preview-paper">
              {form.receipt.logoUrl ? (
                <div className="receipt-preview-logo">
                  <img src={form.receipt.logoUrl} alt="logo" />
                </div>
              ) : null}
              <h5>{form.receipt.title || "CHEK"}</h5>
              {fields.showDate !== false ? <p>Sana: 06.03.2026, 19:30</p> : null}
              {fields.showCashier !== false ? <p>Kassir: admin</p> : null}
              {fields.showPaymentType !== false ? <p>To'lov: Naqd</p> : null}
              {fields.showCustomer !== false ? <p>Mijoz: Test mijoz (+99890...)</p> : null}
              <div className="receipt-preview-sep" />
              {fields.showItemsTable !== false ? (
                <table>
                  <thead>
                    <tr>
                      <th>Mahsulot</th>
                      <th>Miqdor</th>
                      {fields.showItemUnitPrice !== false ? <th>Narx</th> : null}
                      {fields.showItemLineTotal !== false ? <th>Summa</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleRows.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.qty}</td>
                        {fields.showItemUnitPrice !== false ? <td>{row.price}</td> : null}
                        {fields.showItemLineTotal !== false ? <td>{row.total}</td> : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
              <div className="receipt-preview-sep" />
              {fields.showTotal !== false ? <strong>Jami: 31 500 so'm</strong> : null}
              <div className="receipt-preview-sep" />
              {fields.showFooter !== false ? <p className="receipt-preview-footer">{form.receipt.footer || "Xaridingiz uchun rahmat!"}</p> : null}
            </div>
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
