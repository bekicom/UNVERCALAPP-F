import { useEffect, useMemo, useState } from "react";
import { Icon } from "../Icon";
import {
  formatDisplayMoney,
  formatMoney,
  getCategoryName,
  getSupplierName,
  normalizeUnit,
} from "../../utils/format";

const PAGE_SIZE = 15;
export function ProductsSection({
  products,
  lowStockThreshold = 0,
  displayCurrency = "uzs",
  usdRate = 12171,
  onRestock,
  onEdit,
  onDelete
}) {
  const [page, setPage] = useState(1);
  const formatProductPrice = (_, value) => formatDisplayMoney(value, displayCurrency, usdRate);
  const formatCurrency = (amount) => formatDisplayMoney(amount, displayCurrency, usdRate);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedProducts = useMemo(
    () => products.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [products, safePage]
  );

  useEffect(() => {
    setPage(1);
  }, [products]);

  return (
    <section className="products-section">
      <div className="table-wrap products-table-wrap">
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
            {pagedProducts.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.model}</td>
                <td>{getCategoryName(p)}</td>
                <td>{getSupplierName(p)}</td>
                <td>{formatProductPrice(p, p.purchasePrice)}</td>
                <td>{formatProductPrice(p, p.retailPrice)}</td>
                <td>{formatProductPrice(p, p.wholesalePrice)}</td>
                <td>
                  {p.paymentType || "naqd"} / {formatCurrency(p.debtAmount)}
                </td>
                <td>
                  {p.unit === "qop" && p.allowPieceSale
                    ? `1 qop = ${p.pieceQtyPerBase} ${p.pieceUnit}, 1 ${p.pieceUnit} = ${formatProductPrice(p, p.piecePrice)}`
                    : "-"}
                </td>
                <td className={Number(p.quantity || 0) <= Number(lowStockThreshold || 0) ? "stock" : ""}>{p.quantity}</td>
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
      </div>
      {products.length > 0 ? (
        <div className="products-pagination">
          <div className="products-pagination-info">
            <span>Jami: {products.length}</span>
            <span>Sahifa: {safePage} / {totalPages}</span>
          </div>
          <div className="products-pagination-actions">
            <button type="button" className="ghost" disabled={safePage <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>{"<"}</button>
            <button type="button" className="ghost" disabled={safePage >= totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>{">"}</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
