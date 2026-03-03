import { Icon } from "../Icon";
import {
  formatMoney,
  getCategoryName,
  getSupplierName,
  normalizeUnit,
} from "../../utils/format";

export function ProductsSection({ products, onRestock, onEdit, onDelete }) {
  return (
    <section className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Mahsulot nomi</th>
            <th>Modeli</th>
            <th>Kategoriya</th>
            <th>Yetkazib beruvchi</th>
            <th>Kelish narxi</th>
            <th>Dona narxi</th>
            <th>Optom narxi</th>
            <th>To'lov / Qarz</th>
            <th>Xisobot</th>
            <th>Miqdori</th>
            <th>Birligi</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.model}</td>
              <td>{getCategoryName(p)}</td>
              <td>{getSupplierName(p)}</td>
              <td>{formatMoney(p.purchasePrice)}</td>
              <td>{formatMoney(p.retailPrice)}</td>
              <td>{formatMoney(p.wholesalePrice)}</td>
              <td>
                {p.paymentType || "naqd"} / {formatMoney(p.debtAmount)}
              </td>
              <td>
                {p.unit === "qop" && p.allowPieceSale
                  ? `1 qop = ${p.pieceQtyPerBase} ${p.pieceUnit}, 1 ${p.pieceUnit} = ${formatMoney(p.piecePrice)}`
                  : "-"}
              </td>
              <td className="stock">{p.quantity}</td>
              <td>{normalizeUnit(p.unit)}</td>
              <td className="actions-cell">
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => onRestock(p)}
                >
                  <Icon name="download" />
                  Kirim
                </button>
                <button
                  type="button"
                  className="action-btn edit"
                  onClick={() => onEdit(p)}
                >
                  <Icon name="edit" />
                  edit
                </button>
                <button
                  type="button"
                  className="action-btn delete"
                  onClick={() => onDelete(p._id)}
                >
                  <Icon name="trash" />
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 ? (
            <tr>
              <td colSpan="12">Mahsulot topilmadi</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
