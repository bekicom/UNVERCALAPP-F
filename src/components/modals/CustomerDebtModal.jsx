import { useState } from "react";
import { formatMoney } from "../../utils/format";

function fmtDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

export function CustomerDebtModal({
  open,
  customer,
  sales,
  payments,
  totals,
  form,
  setForm,
  loading,
  payLoading,
  error,
  paymentError,
  onPay,
  onClose
}) {
  if (!open) return null;
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const sortedSales = [...(sales || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const topDate = sortedSales[0]?.createdAt ? new Date(sortedSales[0].createdAt).toISOString().slice(0, 10) : "-";
  const totalDebt = Number(totals?.totalDebt || 0);
  const totalPaid = Number(totals?.totalPaid || 0);
  const totalDebtAllTime = Math.max(0, totalDebt + totalPaid);
  const setQuickAmount = (ratio) => {
    const next = Math.max(0, Math.round(totalDebt * ratio));
    setForm((p) => ({ ...p, amount: String(next) }));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal-card modal-wide customer-modal" onClick={(e) => e.stopPropagation()}>
        <header className="customer-modal-head">
          <div>
            <h3>{customer?.fullName || "Mijoz"} - Qarz tarixi</h3>
            <p className="modal-subtitle">{customer?.phone || "-"} | {customer?.address || "-"}</p>
          </div>
          <button type="button" className="customer-modal-close" onClick={onClose}>x</button>
        </header>

        <div className="customer-modal-body">
          <h4 className="customer-modal-date">{topDate}</h4>

          <div className="customer-kpi-row">
            <article className="customer-kpi k1">
              <p>Jami qarz</p>
              <strong>{formatMoney(totalDebtAllTime)} so'm</strong>
            </article>
            <article className="customer-kpi k2">
              <p>To'langan</p>
              <strong>{formatMoney(totalPaid)} so'm</strong>
            </article>
            <article className="customer-kpi k3">
              <p>Qolgan qarz</p>
              <strong>{formatMoney(totalDebt)} so'm</strong>
              <small>Pozitsiya: {sortedSales.length}</small>
            </article>
          </div>

          {loading ? <p className="hint">Yuklanmoqda...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          <form className="customer-pay-bar" onSubmit={onPay}>
            <label className="customer-pay-field">
              <span>To'lov summasi</span>
              <input
                type="number"
                min="1"
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                placeholder="Summa"
                required
              />
            </label>
            <label className="customer-pay-field customer-pay-note">
              <span>Izoh</span>
              <input
                value={form.note}
                onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                placeholder="Izoh: Qisman to'lov"
              />
            </label>
            <div className="customer-pay-quick">
              <button type="button" className="ghost" onClick={() => setQuickAmount(0.25)}>25%</button>
              <button type="button" className="ghost" onClick={() => setQuickAmount(0.5)}>50%</button>
              <button type="button" className="ghost" onClick={() => setQuickAmount(1)}>100%</button>
            </div>
            <button type="submit" className="customer-pay-submit" disabled={payLoading}>
              {payLoading ? "Saqlanmoqda..." : "Qarz to'lash"}
            </button>
          </form>

          <div className="customer-pay-totals">
            <p>Jami savdo: <strong>{formatMoney(totals?.totalSalesAmount || 0)} so'm</strong></p>
            <p>Jami to'langan: <strong>{formatMoney(totalPaid)} so'm</strong></p>
            <p>
              To'lovlar soni: <strong>{payments?.length || 0}</strong>
              <button
                type="button"
                className="ghost customer-history-open-btn"
                onClick={() => setPaymentHistoryOpen(true)}
              >
                To'lov tarixi
              </button>
            </p>
          </div>
          {paymentError ? <p className="error-text">{paymentError}</p> : null}

          <section className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Sana</th>
                  <th>Mahsulot</th>
                  <th>Miqdor</th>
                  <th>Jami</th>
                  <th>To'langan</th>
                  <th>Qarz</th>
                </tr>
              </thead>
              <tbody>
                {sortedSales.length < 1 ? (
                  <tr><td colSpan={6}>Savdolar topilmadi</td></tr>
                ) : sortedSales.map((s) => {
                  const paid = Math.max(0, Number(s.totalAmount || 0) - Number(s.debtAmount || 0));
                  return (
                    <tr key={s._id}>
                      <td>{fmtDate(s.createdAt)}</td>
                      <td>{(s.items || []).map((it) => `${it.productName} (${it.productModel || "-"})`).join(", ")}</td>
                      <td>{(s.items || []).map((it) => `${it.quantity} ${it.unit}`).join(", ")}</td>
                      <td>{formatMoney(s.totalAmount || 0)} so'm</td>
                      <td>{formatMoney(paid)} so'm</td>
                      <td className="stock">{formatMoney(s.debtAmount || 0)} so'm</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>Yopish</button>
          </div>

          {paymentHistoryOpen ? (
            <div className="modal-backdrop customer-inner-backdrop" onClick={() => setPaymentHistoryOpen(false)}>
              <section className="modal-card modal-wide customer-history-modal" onClick={(e) => e.stopPropagation()}>
                <div className="customer-history-head">
                  <h4>To'lovlar tarixi</h4>
                  <button type="button" className="ghost" onClick={() => setPaymentHistoryOpen(false)}>Yopish</button>
                </div>
                <section className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Sana</th>
                        <th>Summa</th>
                        <th>Kim olgan</th>
                        <th>Izoh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(payments || []).length < 1 ? (
                        <tr><td colSpan={4}>To'lovlar hali yo'q</td></tr>
                      ) : (payments || []).map((p) => (
                        <tr key={p._id}>
                          <td>{fmtDate(p.paidAt)}</td>
                          <td>{formatMoney(p.amount || 0)} so'm</td>
                          <td>{p.cashierUsername || "-"}</td>
                          <td>{p.note || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </section>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
