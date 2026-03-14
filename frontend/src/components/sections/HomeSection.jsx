import { useMemo } from "react";
import { formatDisplayMoney, formatMoney } from "../../utils/format";
import { Icon } from "../Icon";

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "-";
  }
}

function formatTime(value) {
  try {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "-";
  }
}

function inRange(value, dateFrom, dateTo) {
  if (!value) return true;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  if (dateFrom) {
    const from = new Date(dateFrom);
    if (!Number.isNaN(from.getTime()) && d < from) return false;
  }
  if (dateTo) {
    const to = new Date(dateTo);
    if (!Number.isNaN(to.getTime())) {
      to.setHours(23, 59, 59, 999);
      if (d > to) return false;
    }
  }
  return true;
}

function toDateInput(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function paymentLabelUz(value) {
  const v = String(value || "").toLowerCase();
  if (v === "cash") return "Naqd";
  if (v === "card") return "Karta";
  if (v === "click") return "Click";
  if (v === "mixed") return "Aralash";
  if (v === "debt") return "Qarzga";
  if (v === "debt_payment") return "Qarzdor to'lovi";
  return value || "-";
}

export function HomeSection({
  overview,
  products,
  suppliers,
  expenses,
  sales,
  salesSummary,
  returns,
  returnsSummary,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  search,
  setSearch,
<<<<<<< HEAD
  displayCurrency = "uzs",
  usdRate = 12171
=======
  displayCurrency,
  usdRate
>>>>>>> e64c8a94615163a6ef7cf6ceb874e582ca477756
}) {
  const filteredExpenses = useMemo(
    () => expenses.filter((e) => inRange(e.spentAt || e.createdAt, dateFrom, dateTo)),
    [expenses, dateFrom, dateTo]
  );

  const totalStockQty = useMemo(
    () => products.reduce((sum, p) => sum + Number(p.quantity || 0), 0),
    [products]
  );
  const stockCostValue = useMemo(
    () => products.reduce((sum, p) => sum + (Number(p.quantity || 0) * Number(p.purchasePrice || 0)), 0),
    [products]
  );
  const stockRetailValue = useMemo(
    () => products.reduce((sum, p) => sum + (Number(p.quantity || 0) * Number(p.retailPrice || 0)), 0),
    [products]
  );
  const totalDebt = useMemo(
    () => suppliers.reduce((sum, s) => sum + Number(s?.stats?.totalDebt || 0), 0),
    [suppliers]
  );
  const expenseTotal = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [filteredExpenses]
  );
  const cardSales = Number(salesSummary.totalCard || 0);
  const cardExpense = Math.round(expenseTotal * 0.35);
  const formatCurrency = (amount) => formatDisplayMoney(amount, displayCurrency, usdRate);

  const lowStockProducts = useMemo(
    () => products
      .filter((p) => Number(p.quantity || 0) <= 25)
      .sort((a, b) => Number(a.quantity || 0) - Number(b.quantity || 0))
      .slice(0, 8),
    [products]
  );
  const topDebtors = useMemo(
    () => suppliers
      .filter((s) => Number(s?.stats?.totalDebt || 0) > 0)
      .sort((a, b) => Number(b?.stats?.totalDebt || 0) - Number(a?.stats?.totalDebt || 0))
      .slice(0, 5),
    [suppliers]
  );

  const soldByCategory = useMemo(() => {
    const map = new Map();
    for (const sale of sales || []) {
      for (const item of sale.items || []) {
        const qty = Number(item.quantity || 0) - Number(item.returnedQuantity || 0);
        map.set(item.productName || "Noma'lum", (map.get(item.productName || "Noma'lum") || 0) + Math.max(0, qty));
      }
    }
    const rows = [...map.entries()].map(([name, qty]) => ({ name, qty }));
    rows.sort((a, b) => b.qty - a.qty);
    const max = rows[0]?.qty || 1;
    return rows.slice(0, 6).map((r) => ({ ...r, percent: Math.round((r.qty / max) * 100) }));
  }, [sales]);

  const recentEvents = useMemo(() => {
    const saleEvents = (sales || []).map((s) => ({
      type: "Savdo",
      date: s.createdAt,
      products: (s.items || []).map((it) => `${it.productName}`).join(", "),
      payment: paymentLabelUz(s.paymentType),
      amount: Number(s.totalAmount || 0)
    }));
    const returnEvents = (returns || []).map((r) => ({
      type: "Vozvrat",
      date: r.returnCreatedAt,
      products: (r.items || []).map((it) => `${it.productName}`).join(", "),
      payment: paymentLabelUz(r.paymentType),
      amount: Number(r.totalAmount || 0)
    }));
    const expenseEvents = (filteredExpenses || []).map((e) => ({
      type: "Xarajat",
      date: e.spentAt,
      products: e.reason,
      payment: "-",
      amount: Number(e.amount || 0)
    }));
    const all = [...saleEvents, ...returnEvents, ...expenseEvents]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const q = search.trim().toLowerCase();
    const filtered = q
      ? all.filter((e) => [e.type, e.products, e.payment, formatMoney(e.amount)].join(" ").toLowerCase().includes(q))
      : all;
    return filtered.slice(0, 8);
  }, [sales, returns, filteredExpenses, search]);

  const setPreset = (days) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days + 1);
    setDateFrom(toDateInput(from));
    setDateTo(toDateInput(to));
  };

  return (
    <section className="homex-wrap v2">
      <section className="homex-topbar">
        <div>
          <h2>Asosiy Dashboard</h2>
          <p>Bosh sahifa: Umumiy sotuvlar, saqlash holati va keyingi harakatlar.</p>
        </div>
        <div className="homex-topbar-right">
          <input
            className="homex-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Qidirish..."
          />
          <div className="homex-range">
            <label><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></label>
            <label><input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></label>
            <div className="homex-presets">
              <button type="button" onClick={() => setPreset(1)}>Bugun</button>
              <button type="button" onClick={() => setPreset(7)}>O'tgan 7 kun</button>
              <button type="button" onClick={() => setPreset(30)}>O'tgan 30 kun</button>
            </div>
          </div>
        </div>
      </section>

      <section className="homex-kpis v2">
        <article className="homex-kpi c1">
          <span className="homex-kpi-title"><Icon name="cash" />Tushum</span>
          <strong>{formatCurrency(salesSummary.totalRevenue || 0)}</strong>
          <small>Umumiy tushum</small>
        </article>
        <article className="homex-kpi c2">
          <span className="homex-kpi-title"><Icon name="wallet" />Chiqim</span>
          <strong>{formatCurrency(expenseTotal)}</strong>
          <small>Hammasi chiqim</small>
        </article>
        <article className="homex-kpi c3">
          <span className="homex-kpi-title"><Icon name="briefcase" />Foyda</span>
          <strong>{formatCurrency(salesSummary.totalProfit || 0)}</strong>
          <small>Jami foyda</small>
        </article>
        <article className="homex-kpi c4">
          <span className="homex-kpi-title"><Icon name="clipboard" />Karta</span>
          <strong>{formatCurrency(cardSales)}</strong>
          <small>Karta orqali tushum</small>
        </article>
        <article className="homex-kpi c5">
          <span className="homex-kpi-title"><Icon name="download" />Karta orqali chiqim</span>
          <strong>{formatCurrency(cardExpense)}</strong>
          <small>Karta orqali chiqim</small>
        </article>
      </section>

      <section className="homex-mid">
        <article className="homex-panel">
          <h3>Ombor Hisobi</h3>
          <p className="big">{formatCurrency(stockRetailValue)}</p>
          <p className="hint">{formatMoney(totalStockQty)} dona mahsulotlar qoldi</p>
          <div className="homex-list">
            {lowStockProducts.map((p) => (
              <div key={p._id} className="homex-row"><span>{p.name}</span><strong>{formatMoney(p.quantity)} {p.unit}</strong></div>
            ))}
            {lowStockProducts.length < 1 ? <p className="hint">Kam qoldiq yo'q</p> : null}
          </div>
        </article>

        <article className="homex-panel">
          <h3>Qarzdorlik</h3>
          <div className="homex-debt-totals">
            <p>Umumiy: <strong>{formatCurrency(totalDebt)}</strong></p>
            <p>To'lanmagan: <strong>{formatCurrency(totalDebt)}</strong></p>
          </div>
          <div className="homex-list">
            {topDebtors.map((s) => (
              <div key={s._id} className="homex-row"><span>{s.name}</span><strong>{formatCurrency(s?.stats?.totalDebt || 0)}</strong></div>
            ))}
            {topDebtors.length < 1 ? <p className="hint">Qarz yo'q</p> : null}
          </div>
        </article>

        <article className="homex-panel">
          <h3>Eng ko'p sotilgan kategoriyalar</h3>
          <div className="homex-bars">
            {soldByCategory.map((c) => (
              <div key={c.name} className="homex-bar-row">
                <div className="homex-bar-label"><span>{c.name}</span><strong>{formatMoney(c.qty)}</strong></div>
                <div className="homex-bar-track"><div className="homex-bar-fill" style={{ width: `${c.percent}%` }} /></div>
              </div>
            ))}
            {soldByCategory.length < 1 ? <p className="hint">Sotuv yo'q</p> : null}
          </div>
        </article>
      </section>

      <section className="homex-panel">
        <h3>Oxirgi Jarayonlar</h3>
        <div className="homex-table-wrap">
          <table className="homex-table">
            <thead>
              <tr>
                <th>Sana</th>
                <th>Kategoriya</th>
                <th>Mahsulotlar</th>
                <th>To'lov</th>
                <th>Summa</th>
                <th>Vaqt</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.length < 1 ? (
                <tr><td colSpan={6}>Jarayon topilmadi</td></tr>
              ) : recentEvents.map((e, idx) => (
                <tr key={`${e.type}-${idx}`}>
                  <td>{formatDate(e.date)}</td>
                  <td><span className={`homex-type ${e.type.toLowerCase()}`}>{e.type}</span></td>
                  <td>{e.products}</td>
                  <td>{e.payment || "-"}</td>
                  <td>{formatCurrency(e.amount)}</td>
                  <td>{formatTime(e.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="homex-foot v2">
        <article className="homex-foot-card"><strong>Skladda: {formatMoney(totalStockQty)}</strong><span>dona mahsulot</span></article>
        <article className="homex-foot-card"><strong>Mahsulotlar soni</strong><span>{overview?.stats?.products || 0}</span></article>
        <article className="homex-foot-card"><strong>Vozvratlar soni</strong><span>{returnsSummary.totalReturns || 0}</span></article>
        <article className="homex-foot-card"><strong>Ombor tannarxi</strong><span>{formatCurrency(stockCostValue)}</span></article>
        <article className="homex-foot-card"><strong>Ombor sotuv qiymati</strong><span>{formatCurrency(stockRetailValue)}</span></article>
      </section>
    </section>
  );
}
