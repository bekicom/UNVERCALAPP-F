import { useEffect, useMemo, useState } from "react";
import { Icon } from "../Icon";

const PAGE_SIZE = 15;

export function CategoriesSection({ categories, onEdit, onDelete }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedCategories = useMemo(
    () => categories.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [categories, safePage]
  );

  useEffect(() => {
    setPage(1);
  }, [categories]);

  return (
    <section className="products-section">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nomi</th>
              <th>Mahsulotlar soni</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {pagedCategories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.productCount || 0}</td>
                <td className="actions-cell">
                  <button type="button" className="action-btn edit" onClick={() => onEdit(category)}>
                    <Icon name="edit" />
                    edit
                  </button>
                  <button type="button" className="action-btn delete" onClick={() => onDelete(category._id)}>
                    <Icon name="trash" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3">Kategoriya topilmadi</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {categories.length > 0 ? (
        <div className="products-pagination">
          <div className="products-pagination-info">
            <span>Jami: {categories.length}</span>
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
