import { formatMoney } from "../../utils/format";

export function SupplierHistoryModal({ open, supplier, daily, purchases, loading, error, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-wide" onClick={(e) => e.stopPropagation()}>
        <h3>{supplier?.name} - Kirim tarixi</h3>
        {loading ? <p className="hint">Yuklanmoqda...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!loading ? (
          <>
            <div className="history-grid">
              {daily.map((d) => (
                <div key={d._id} className="history-item">
                  <strong>{d._id}</strong>
                  <p>Jami summa: {formatMoney(d.totalCost)} so'm</p>
                  <p>To'langan: {formatMoney(d.totalPaid)} so'm</p>
                  <p>Qarz: {formatMoney(d.totalDebt)} so'm</p>
                  <p>Pozitsiya: {d.items}</p>
                </div>
              ))}
              {daily.length === 0 ? <p className="hint">Tarix topilmadi</p> : null}
            </div>

            <section className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Mahsulot</th>
                    <th>Miqdor</th>
                    <th>Kelish narxi</th>
                    <th>Jami</th>
                    <th>To'langan</th>
                    <th>Qarz</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p._id}>
                      <td>{new Date(p.purchasedAt).toLocaleString()}</td>
                      <td>{p.productName} ({p.productModel})</td>
                      <td>{p.quantity} {p.unit}</td>
                      <td>{formatMoney(p.purchasePrice)}</td>
                      <td>{formatMoney(p.totalCost)}</td>
                      <td>{formatMoney(p.paidAmount)}</td>
                      <td className="stock">{formatMoney(p.debtAmount)}</td>
                    </tr>
                  ))}
                  {purchases.length === 0 ? <tr><td colSpan="7">Kirim topilmadi</td></tr> : null}
                </tbody>
              </table>
            </section>
          </>
        ) : null}

        <div className="modal-actions">
          <button type="button" className="ghost" onClick={onClose}>Yopish</button>
        </div>
      </div>
    </div>
  );
}
