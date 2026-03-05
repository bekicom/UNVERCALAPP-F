import { useMemo, useState } from "react";
import { formatMoney } from "../../utils/format";

function formatDateTime(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

function paymentLabel(value) {
  const v = String(value || "").toLowerCase();
  if (v === "cash") return "Naqd";
  if (v === "card") return "Karta";
  if (v === "click") return "Click";
  if (v === "mixed") return "Aralash";
  if (v === "debt") return "Qarzga";
  if (v === "debt_payment") return "Qarz to'lovi";
  return v || "-";
}

const PAGE_SIZE = 8;

export function SalesSection({
  sales,
  summary,
  loading,
  error,
  search,
  setSearch,
  period,
  setPeriod,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo
}) {
  const [page, setPage] = useState(1);
  const safeSummary = summary || {};

  const q = search.trim().toLowerCase();
  const visibleSales = useMemo(() => (
    q
      ? sales.filter((sale) => [sale.cashierUsername, sale.paymentType, sale.customerName, sale.note, ...(sale.items || []).map((it) => it.productName)]
        .join(" ")
        .toLowerCase()
        .includes(q))
      : sales
  ), [sales, q]);

  const totalPages = Math.max(1, Math.ceil(visibleSales.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedSales = visibleSales.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const periodOptions = [
    { key: "today", label: "1 kunlik" },
    { key: "yesterday", label: "Kecha" },
    { key: "7d", label: "7 kun" },
    { key: "30d", label: "30 kun" },
    { key: "all", label: "Hammasi" }
  ];

  const totalExpense = Math.max(
    0,
    Number(safeSummary.totalExpense ?? (Number(safeSummary.totalRevenue || 0) - Number(safeSummary.totalProfit || 0)))
  );
  const totalDebt = useMemo(
    () => sales.reduce((sum, sale) => sum + Number(sale.debtAmount || 0), 0),
    [sales]
  );

  return (
    <section className="salesx-wrap">
      <section className="salesx-header">
        <div className="salesx-head-main">
          <h2>Sotuv tarixi</h2>
          <div className="salesx-periods">
            {periodOptions.map((opt) => (
              <button
                type="button"
                key={opt.key}
                className={period === opt.key ? "active" : ""}
                onClick={() => { setPeriod(opt.key); setPage(1); }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="salesx-dates">
            <label>Dan<input type="date" value={dateFrom} onChange={(e) => { setPeriod("all"); setDateFrom(e.target.value); setPage(1); }} /></label>
            <label>Gacha<input type="date" value={dateTo} onChange={(e) => { setPeriod("all"); setDateTo(e.target.value); setPage(1); }} /></label>
          </div>
        </div>
        <div className="salesx-search">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Qidirish..."
          />
        </div>
      </section>

      <section className="salesx-cards">
        <article className="salesx-card s1"><p>Savdolar</p><strong>{safeSummary.totalSales || 0}</strong></article>
        <article className="salesx-card s2"><p>Kassaga tushgan</p><strong>{formatMoney(safeSummary.totalCollection || 0)}</strong></article>
        <article className="salesx-card s5"><p>Qarz to'lovi</p><strong>{formatMoney(safeSummary.totalDebtPayment || 0)}</strong></article>
        <article className="salesx-card s3"><p>Karta</p><strong>{formatMoney(safeSummary.totalCard || 0)}</strong></article>
        <article className="salesx-card s4"><p>Naqd</p><strong>{formatMoney(safeSummary.totalCash || 0)}</strong></article>
        <article className="salesx-card s5"><p>Click</p><strong>{formatMoney(safeSummary.totalClick || 0)}</strong></article>
        <article className="salesx-card s3"><p>Qarz</p><strong>{formatMoney(totalDebt)}</strong></article>
        <article className="salesx-card s2"><p>Savdo tushumi</p><strong>{formatMoney(safeSummary.totalRevenue || 0)}</strong></article>
        <article className="salesx-card s5"><p>Chiqim / Foyda</p><strong>{formatMoney(totalExpense)} / {formatMoney(safeSummary.totalProfit || 0)}</strong></article>
      </section>

      <section className="salesx-table-wrap">
        <table className="salesx-table">
          <thead>
            <tr>
              <th>Sana</th>
              <th>Kassir</th>
              <th>Mahsulotlar</th>
              <th>Soni</th>
              <th>To'lov</th>
              <th>Naqd</th>
              <th>Karta</th>
              <th>Click</th>
              <th>Qarz</th>
              <th>Chiqim</th>
              <th>Tushum</th>
              <th>Foyda</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={12}>Yuklanmoqda...</td></tr>
            ) : error ? (
              <tr><td colSpan={12}>Xatolik: {error?.data?.message || error?.message || "Noma'lum xato"}</td></tr>
            ) : pagedSales.length < 1 ? (
              <tr><td colSpan={12}>Sotuv topilmadi</td></tr>
            ) : pagedSales.map((sale) => {
              const isDebtPayment = sale.transactionType === "debt_payment" || sale.paymentType === "debt_payment";
              const productNamesText = (sale.items || [])
                .map((it) => it.productName)
                .join(", ");
              const productQtyText = (sale.items || [])
                .map((it) => {
                  const soldQty = Number(it.quantity || 0);
                  const returnedQty = Number(it.returnedQuantity || 0);
                  const leftQty = Math.max(0, soldQty - returnedQty);
                  return `${formatMoney(leftQty)}/${formatMoney(soldQty)} ${it.unit}`;
                })
                .join(", ");
              const saleProfit = isDebtPayment ? 0 : (sale.items || [])
                .reduce((sum, it) => sum + (Number(it.lineProfit || 0) - Number(it.returnedProfit || 0)), 0);
              const saleCost = isDebtPayment ? 0 : Math.max(0, Number(sale.totalAmount || 0) - Number(saleProfit || 0));
              return (
                <tr key={sale._id}>
                  <td>{formatDateTime(sale.createdAt)}</td>
                  <td>{sale.cashierUsername}</td>
                  <td>{isDebtPayment ? `Qarz to'lovi${sale.customerName ? ` (${sale.customerName})` : ""}` : productNamesText}</td>
                  <td>{isDebtPayment ? "-" : productQtyText}</td>
                  <td><span className="salesx-pay-badge">{paymentLabel(sale.paymentType)}</span></td>
                  <td>{formatMoney(sale.payments?.cash || 0)}</td>
                  <td>{formatMoney(sale.payments?.card || 0)}</td>
                  <td>{formatMoney(sale.payments?.click || 0)}</td>
                  <td>{formatMoney(sale.debtAmount || 0)}</td>
                  <td>{formatMoney(saleCost)}</td>
                  <td>{formatMoney(sale.totalAmount || 0)}</td>
                  <td className="salesx-profit">{formatMoney(saleProfit)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="salesx-pagination">
          <button type="button" className="ghost" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>{"<"}</button>
          <span>{safePage}</span>
          <span>/</span>
          <span>{totalPages}</span>
          <button type="button" className="ghost" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>{">"}</button>
        </div>
      </section>
    </section>
  );
}
