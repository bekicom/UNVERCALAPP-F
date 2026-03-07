import { useMemo, useState } from "react";
import { formatMoney } from "../../utils/format";

const PAGE_SIZE = 8;

export function CustomersSection({ customers, summary, search, setSearch, onOpenLedger }) {
  const [page, setPage] = useState(1);

  const q = search.trim().toLowerCase();
  const visibleCustomers = useMemo(() => (
    q
      ? customers.filter((c) => [c.fullName, c.phone, c.address, String(c.totalDebt || 0), String(c.totalPaid || 0)]
        .join(" ")
        .toLowerCase()
        .includes(q))
      : customers
  ), [customers, q]);

  const totalPages = Math.max(1, Math.ceil(visibleCustomers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedCustomers = visibleCustomers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="salesx-wrap">
      <section className="salesx-header">
        <div className="salesx-head-main">
          <h2>Clientlar</h2>
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
        <article className="salesx-card s1"><p>Mijozlar</p><strong>{summary?.totalCustomers || 0}</strong></article>
        <article className="salesx-card s2"><p>Qarzdorlar</p><strong>{summary?.activeDebtors || 0}</strong></article>
        <article className="salesx-card s3"><p>Jami qarz</p><strong>{formatMoney(summary?.totalDebt || 0)}</strong></article>
        <article className="salesx-card s4"><p>Jami to'langan</p><strong>{formatMoney(summary?.totalPaid || 0)}</strong></article>
      </section>

      <section className="salesx-table-wrap">
        <table className="salesx-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ism-familya</th>
              <th>Telefon</th>
              <th>Manzil</th>
              <th>Qarz</th>
              <th>To'langan</th>
              <th>Amal</th>
            </tr>
          </thead>
          <tbody>
            {pagedCustomers.length < 1 ? (
              <tr><td colSpan={7}>Mijozlar topilmadi</td></tr>
            ) : pagedCustomers.map((c, idx) => (
              <tr key={c._id}>
                <td>{(safePage - 1) * PAGE_SIZE + idx + 1}</td>
                <td>{c.fullName}</td>
                <td>{c.phone}</td>
                <td>{c.address}</td>
                <td>
                  <span className="salesx-pay-badge">{formatMoney(c.totalDebt || 0)}</span>
                </td>
                <td>{formatMoney(c.totalPaid || 0)}</td>
                <td>
                  <button type="button" className="ghost" onClick={() => onOpenLedger(c)}>Ko'rish</button>
                </td>
              </tr>
            ))}
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
