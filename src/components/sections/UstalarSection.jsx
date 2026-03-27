import { useMemo, useState } from "react";
import { formatDisplayMoney } from "../../utils/format";

const PAGE_SIZE = 10;

export function UstalarSection({
  masters,
  summary,
  search,
  setSearch,
  onOpenLedger,
  displayCurrency = "uzs",
  usdRate = 12171
}) {
  const [page, setPage] = useState(1);
  const formatCurrency = (amount) => formatDisplayMoney(amount, displayCurrency, usdRate);

  const rows = useMemo(() => (
    (masters || []).flatMap((master) => (
      (master.vehicles || [])
        .filter((vehicle) => Number(vehicle.totalDebt || 0) > 0)
        .map((vehicle) => ({
          key: `${master._id}:${vehicle._id}`,
          master,
          vehicle
        }))
    ))
  ), [masters]);

  const q = search.trim().toLowerCase();
  const visibleRows = useMemo(() => (
    q
      ? rows.filter(({ master, vehicle }) => [master.fullName, master.phone, vehicle.plateNumber, vehicle.model, String(vehicle.totalDebt || 0)]
        .join(" ")
        .toLowerCase()
        .includes(q))
      : rows
  ), [rows, q]);

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = visibleRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="salesx-wrap">
      <section className="salesx-header">
        <div className="salesx-head-main">
          <h2>USTALAR</h2>
        </div>
        <div className="salesx-search">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Usta, mashina raqami, model..."
          />
        </div>
      </section>

      <section className="salesx-cards">
        <article className="salesx-card s1"><p>Ustalar</p><strong>{summary?.totalMasters || 0}</strong></article>
        <article className="salesx-card s2"><p>Mashinalar</p><strong>{summary?.totalVehicles || 0}</strong></article>
        <article className="salesx-card s3"><p>Qarzdor mashina</p><strong>{summary?.activeVehicles || 0}</strong></article>
        <article className="salesx-card s4"><p>Jami qarz</p><strong>{formatCurrency(summary?.totalDebt || 0)}</strong></article>
      </section>

      <section className="salesx-table-wrap">
        <table className="salesx-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Usta</th>
              <th>Telefon</th>
              <th>Mashina raqami</th>
              <th>Model</th>
              <th>Qarz</th>
              <th>To'langan</th>
              <th>Amal</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.length < 1 ? (
              <tr><td colSpan={8}>Ustalar topilmadi</td></tr>
            ) : pagedRows.map(({ key, master, vehicle }, idx) => (
              <tr key={key}>
                <td>{(safePage - 1) * PAGE_SIZE + idx + 1}</td>
                <td>{master.fullName}</td>
                <td>{master.phone || "-"}</td>
                <td>{vehicle.plateNumber}</td>
                <td>{vehicle.model || "-"}</td>
                <td><span className="salesx-pay-badge">{formatCurrency(vehicle.totalDebt || 0)}</span></td>
                <td>{formatCurrency(vehicle.totalPaid || 0)}</td>
                <td>
                  <button type="button" className="ghost" onClick={() => onOpenLedger(master, vehicle)}>Ko'rish</button>
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
