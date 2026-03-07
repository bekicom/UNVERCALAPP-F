import { formatMoney } from "../../utils/format";

export function SupplierHistoryModal({ open, supplier, daily, purchases, loading, error, onClose }) {
  if (!open) return null;

  const fmtWithUsd = (uzs, usd) => {
    const usdNum = Number(usd || 0);
    if (!Number.isFinite(usdNum) || usdNum <= 0) return `${formatMoney(uzs)} so'm`;
    return `${formatMoney(uzs)} so'm (${formatMoney(usdNum)}$)`;
  };

  const fmtPurchaseAmount = (p, uzsAmount) => {
    const isUsd = String(p?.priceCurrency || "").toLowerCase() === "usd";
    const rate = Number(p?.usdRateUsed || 0);
    if (!isUsd || !Number.isFinite(rate) || rate <= 0) return formatMoney(uzsAmount);
    const usd = Number(uzsAmount || 0) / rate;
    return `${formatMoney(uzsAmount)} (${formatMoney(usd)}$)`;
  };

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
                  <p>Jami summa: {fmtWithUsd(d.totalCost, d.totalCostUsd)}</p>
                  <p>To'langan: {fmtWithUsd(d.totalPaid, d.totalPaidUsd)}</p>
                  <p>Qarz: {fmtWithUsd(d.totalDebt, d.totalDebtUsd)}</p>
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
                      <td>{fmtPurchaseAmount(p, p.purchasePrice)}</td>
                      <td>{fmtPurchaseAmount(p, p.totalCost)}</td>
                      <td>{fmtPurchaseAmount(p, p.paidAmount)}</td>
                      <td className="stock">{fmtPurchaseAmount(p, p.debtAmount)}</td>
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
