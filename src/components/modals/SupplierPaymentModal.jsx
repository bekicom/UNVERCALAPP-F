import { Icon } from "../Icon";
import { formatDisplayMoney, formatMoney } from "../../utils/format";

export function SupplierPaymentModal({
  open,
  supplier,
  totals,
  payments,
  debtPurchases,
  form,
  setForm,
  onPay,
  loading,
  paymentLoading,
  error,
  paymentError,
  onClose,
  displayCurrency = "uzs",
  usdRate = 12171
}) {
  if (!open) return null;
  const formatCurrency = (amount) => formatDisplayMoney(amount, displayCurrency, usdRate);

  const fmtWithUsd = (uzs, usd) => {
    if (displayCurrency === "usd") {
      const usdNum = Number(usd || 0);
      if (Number.isFinite(usdNum) && usdNum > 0) return `${formatMoney(usdNum)} $`;
    }
    return formatCurrency(uzs);
  };

  const fmtPurchaseAmount = (p, uzsAmount) => {
    return formatCurrency(uzsAmount);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-wide" onClick={(e) => e.stopPropagation()}>
        <h3>{supplier?.name} - To'lovlar</h3>
        {loading ? <p className="hint">Yuklanmoqda...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!loading ? (
          <>
            <div className="history-grid">
              <div className="history-item">
                <strong>Holat</strong>
                <p>Jami kelish: {fmtWithUsd(totals?.totalPurchase || 0, totals?.totalPurchaseUsd || 0)}</p>
                <p>Jami to'langan: {fmtWithUsd(totals?.totalPaid || 0, totals?.totalPaidUsd || 0)}</p>
                <p>Qolgan qarz: {fmtWithUsd(totals?.totalDebt || 0, totals?.totalDebtUsd || 0)}</p>
              </div>
              <div className="history-item">
                <strong>Qarz to'lovi</strong>
                <form className="modal-form" onSubmit={onPay}>
                  <label>
                    To'lov summasi
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Izoh
                    <input
                      value={form.note}
                      onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                      placeholder="Masalan: karta orqali"
                    />
                  </label>
                  {paymentError ? <p className="error-text">{paymentError}</p> : null}
                  <button type="submit" disabled={paymentLoading || Number(totals?.totalDebt || 0) <= 0}>
                    <Icon name="wallet" />
                    {paymentLoading ? "To'lanmoqda..." : "To'lovni saqlash"}
                  </button>
                </form>
              </div>
            </div>

            <section className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>To'lov summasi</th>
                    <th>Izoh</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id}>
                      <td>{new Date(p.paidAt).toLocaleString()}</td>
                      <td>{formatCurrency(p.amount)}</td>
                      <td>{p.note || "-"}</td>
                    </tr>
                  ))}
                  {payments.length === 0 ? <tr><td colSpan="3">To'lov tarixi yo'q</td></tr> : null}
                </tbody>
              </table>
            </section>

            <section className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Mahsulot</th>
                    <th>Jami qarz qoldig'i</th>
                  </tr>
                </thead>
                <tbody>
                  {debtPurchases.map((p) => (
                    <tr key={p._id}>
                      <td>{new Date(p.purchasedAt).toLocaleString()}</td>
                      <td>{p.entryType === "opening_balance" ? "Boshlang'ich astatka" : `${p.productName} (${p.productModel})`}</td>
                      <td className="stock">{fmtPurchaseAmount(p, p.debtAmount)}</td>
                    </tr>
                  ))}
                  {debtPurchases.length === 0 ? <tr><td colSpan="3">Ochiq qarz yo'q</td></tr> : null}
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
