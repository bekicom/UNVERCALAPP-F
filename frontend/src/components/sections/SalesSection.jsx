import { formatMoney } from "../../utils/format";

function formatDateTime(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

export function SalesSection({
  sales,
  summary,
  loading,
  error,
  search,
  period,
  setPeriod,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo
}) {
  const q = search.trim().toLowerCase();
  const visibleSales = q
    ? sales.filter((sale) => [sale.cashierUsername, sale.paymentType, ...(sale.items || []).map((it) => it.productName)]
      .join(" ")
      .toLowerCase()
      .includes(q))
    : sales;

  return (
    <>
      <section className="cards sales-cards">
        <article className="card sales-mini-card sales-mini-sales"><h2>Sotuvlar</h2><p>{summary.totalSales || 0}</p></article>
        <article className="card sales-mini-card sales-mini-revenue"><h2>Tushum</h2><p>{formatMoney(summary.totalRevenue || 0)}</p></article>
        <article className="card sales-mini-card sales-mini-cash"><h2>Naqd</h2><p>{formatMoney(summary.totalCash || 0)}</p></article>
        <article className="card sales-mini-card sales-mini-cardpay"><h2>Karta</h2><p>{formatMoney(summary.totalCard || 0)}</p></article>
        <article className="card sales-mini-card sales-mini-click"><h2>Click</h2><p>{formatMoney(summary.totalClick || 0)}</p></article>
        <article className="card sales-mini-card sales-mini-profit"><h2>Foyda</h2><p>{formatMoney(summary.totalProfit || 0)}</p></article>
      </section>

      <section className="panel sales-filter-row">
        <div className="sales-filter-buttons">
          <button type="button" className={period === "today" ? "active" : ""} onClick={() => setPeriod("today")}>1 kunlik</button>
          <button type="button" className={period === "yesterday" ? "active" : ""} onClick={() => setPeriod("yesterday")}>Kecha</button>
          <button type="button" className={period === "7d" ? "active" : ""} onClick={() => setPeriod("7d")}>7 kun</button>
          <button type="button" className={period === "30d" ? "active" : ""} onClick={() => setPeriod("30d")}>30 kun</button>
          <button type="button" className={period === "all" ? "active" : ""} onClick={() => setPeriod("all")}>Hammasi</button>
        </div>
        <div className="sales-date-range">
          <label>Dan<input type="date" value={dateFrom} onChange={(e) => { setPeriod("all"); setDateFrom(e.target.value); }} /></label>
          <label>Gacha<input type="date" value={dateTo} onChange={(e) => { setPeriod("all"); setDateTo(e.target.value); }} /></label>
        </div>
      </section>

      <section className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sana</th>
              <th>Kassir</th>
              <th>Mahsulotlar</th>
              <th>To'lov</th>
              <th>Naqd</th>
              <th>Karta</th>
              <th>Click</th>
              <th>Tushum</th>
              <th>Foyda</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9}>Yuklanmoqda...</td></tr>
            ) : error ? (
              <tr><td colSpan={9}>Xatolik: {error?.data?.message || error?.message || "Noma'lum xato"}</td></tr>
            ) : visibleSales.length < 1 ? (
              <tr><td colSpan={9}>Sotuv topilmadi</td></tr>
            ) : visibleSales.map((sale) => {
              const productsText = (sale.items || [])
                .map((it) => `${it.productName} (${it.quantity} ${it.unit})`)
                .join(", ");
              const saleProfit = (sale.items || []).reduce((sum, it) => sum + Number(it.lineProfit || 0), 0);
              return (
                <tr key={sale._id}>
                  <td>{formatDateTime(sale.createdAt)}</td>
                  <td>{sale.cashierUsername}</td>
                  <td>{productsText}</td>
                  <td>{sale.paymentType}</td>
                  <td>{formatMoney(sale.payments?.cash || 0)}</td>
                  <td>{formatMoney(sale.payments?.card || 0)}</td>
                  <td>{formatMoney(sale.payments?.click || 0)}</td>
                  <td>{formatMoney(sale.totalAmount || 0)}</td>
                  <td>{formatMoney(saleProfit)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}
