import { Icon } from "../Icon";
import { formatMoney } from "../../utils/format";

export function SuppliersSection({
  suppliers,
  onOpenPayment,
  onOpenHistory,
  onEdit,
  onDelete,
}) {
  const fmtWithUsd = (uzs, usd) => {
    const usdNum = Number(usd || 0);
    if (!Number.isFinite(usdNum) || usdNum <= 0) return formatMoney(uzs);
    return `${formatMoney(uzs)} (${formatMoney(usdNum)}$)`;
  };

  return (
    <section className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nomi</th>
            <th>Manzili</th>
            <th>Telefon</th>
            <th>Jami kelish</th>
            <th>Jami to'langan</th>
            <th>Jami qarz</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.address || "-"}</td>
              <td>{s.phone || "-"}</td>
              <td>{fmtWithUsd(s.stats?.totalPurchase, s.stats?.totalPurchaseUsd)}</td>
              <td>{fmtWithUsd(s.stats?.totalPaid, s.stats?.totalPaidUsd)}</td>
              <td className="stock">{fmtWithUsd(s.stats?.totalDebt, s.stats?.totalDebtUsd)}</td>
              <td className="actions-cell">
                <button
                  type="button"
                  className="action-btn money"
                  onClick={() => onOpenPayment(s)}
                  title="To'lovlar"
                >
                  <span className="money-symbol">$</span>
                </button>
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => onOpenHistory(s)}
                >
                  <Icon name="history" />
                  Tarix
                </button>
                <button
                  type="button"
                  className="action-btn edit"
                  onClick={() => onEdit(s)}
                >
                  <Icon name="edit" />
                  edit
                </button>
                <button
                  type="button"
                  className="action-btn delete"
                  onClick={() => onDelete(s._id)}
                >
                  <Icon name="trash" />
                </button>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan="7">Yetkazib beruvchi topilmadi</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
