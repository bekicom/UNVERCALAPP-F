import { Icon } from "../Icon";
import { formatDisplayMoney } from "../../utils/format";

export function ExpensesSection({ expenses, onEdit, onDelete, displayCurrency = "uzs", usdRate = 12171 }) {
  const formatCurrency = (amount) => formatDisplayMoney(amount, displayCurrency, usdRate);
  return (
    <section className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Sana</th>
            <th>Summa</th>
            <th>Sababi</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e._id}>
              <td>{new Date(e.spentAt).toLocaleDateString()}</td>
              <td className="stock">{formatCurrency(e.amount)}</td>
              <td>{e.reason}</td>
              <td className="actions-cell">
                <button
                  type="button"
                  className="action-btn edit"
                  onClick={() => onEdit(e)}
                >
                  <Icon name="edit" />
                  edit
                </button>
                <button
                  type="button"
                  className="action-btn delete"
                  onClick={() => onDelete(e._id)}
                >
                  <Icon name="trash" />
                </button>
              </td>
            </tr>
          ))}
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="4">Xarajat topilmadi</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
