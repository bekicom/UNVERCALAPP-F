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
  return v || "-";
}

const PAGE_SIZE = 10;

export function ReturnsSection({
  returns,
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
  const q = search.trim().toLowerCase();

  const filteredReturns = useMemo(() => (
    q
      ? returns.filter((ret) => [ret.cashierUsername, ret.paymentType, ret.note, ...(ret.items || []).map((it) => it.productName)]
        .join(" ")
        .toLowerCase()
        .includes(q))
      : returns
  ), [returns, q]);

  const totalPages = Math.max(1, Math.ceil(filteredReturns.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filteredReturns.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const periodOptions = [
    { key: "today", label: "1 kunlik" },
    { key: "yesterday", label: "Kecha" },
    { key: "7d", label: "7 kun" },
    { key: "30d", label: "30 kun" },
    { key: "all", label: "Hammasi" }
  ];

  return (
    <section className="salesx-wrap">
      <section className="salesx-header">
        <div className="salesx-head-main">
          <h2>Qaytarib olish</h2>
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
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Qidirish..." />
        </div>
      </section>

      <section className="salesx-cards">
        <article className="salesx-card s1"><p>Vozvratlar</p><strong>{summary.totalReturns || 0}</strong></article>
        <article className="salesx-card s2"><p>Jami qaytgan</p><strong>{formatMoney(summary.totalReturnedAmount || 0)}</strong></article>
        <article className="salesx-card s3"><p>Naqd qaytgan</p><strong>{formatMoney(summary.totalReturnedCash || 0)}</strong></article>
        <article className="salesx-card s4"><p>Karta qaytgan</p><strong>{formatMoney(summary.totalReturnedCard || 0)}</strong></article>
        <article className="salesx-card s5"><p>Click / Miqdor</p><strong>{formatMoney(summary.totalReturnedClick || 0)} / {formatMoney(summary.totalReturnedQty || 0)}</strong></article>
      </section>

      <section className="salesx-table-wrap">
        <table className="salesx-table">
          <thead>
            <tr>
              <th>Vaqt</th>
              <th>Sotuv vaqti</th>
              <th>Kassir</th>
              <th>Mahsulotlar</th>
              <th>Soni</th>
              <th>To'lov</th>
              <th>Naqd</th>
              <th>Karta</th>
              <th>Click</th>
              <th>Qaytgan summa</th>
              <th>Izoh</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11}>Yuklanmoqda...</td></tr>
            ) : error ? (
              <tr><td colSpan={11}>Xatolik: {error?.data?.message || error?.message || "Noma'lum xato"}</td></tr>
            ) : visible.length < 1 ? (
              <tr><td colSpan={11}>Vozvratlar topilmadi</td></tr>
            ) : visible.map((ret) => {
              const names = (ret.items || []).map((it) => it.productName).join(", ");
              const qty = (ret.items || []).map((it) => `${formatMoney(it.quantity)} ${it.unit}`).join(", ");
              return (
                <tr key={ret._id}>
                  <td>{formatDateTime(ret.returnCreatedAt)}</td>
                  <td>{formatDateTime(ret.saleCreatedAt)}</td>
                  <td>{ret.cashierUsername}</td>
                  <td>{names}</td>
                  <td>{qty}</td>
                  <td><span className="salesx-pay-badge">{paymentLabel(ret.paymentType)}</span></td>
                  <td>{formatMoney(ret.payments?.cash || 0)}</td>
                  <td>{formatMoney(ret.payments?.card || 0)}</td>
                  <td>{formatMoney(ret.payments?.click || 0)}</td>
                  <td>{formatMoney(ret.totalAmount || 0)}</td>
                  <td>{ret.note || "-"}</td>
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
