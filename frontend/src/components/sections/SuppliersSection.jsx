import { Icon } from "../Icon";
import { formatMoney } from "../../utils/format";

export function SuppliersSection({
  suppliers,
  onOpenPayment,
  onOpenHistory,
  onEdit,
  onDelete
}) {
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
              <td>{formatMoney(s.stats?.totalPurchase)}</td>
              <td>{formatMoney(s.stats?.totalPaid)}</td>
              <td className="stock">{formatMoney(s.stats?.totalDebt)}</td>
              <td className="actions-cell">
                <button type="button" className="action-btn money" onClick={() => onOpenPayment(s)} title="To'lovlar">
                  <span className="money-symbol">$</span>
                </button>
                <button type="button" className="action-btn" onClick={() => onOpenHistory(s)}><Icon name="history" />Tarix</button>
                <button type="button" className="action-btn edit" onClick={() => onEdit(s)}><Icon name="edit" />Tahrirlash</button>
                <button type="button" className="action-btn delete" onClick={() => onDelete(s._id)}><Icon name="trash" />O'chirish</button>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 ? <tr><td colSpan="7">Yetkazib beruvchi topilmadi</td></tr> : null}
        </tbody>
      </table>
    </section>
  );
}
