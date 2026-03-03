import { PRODUCT_UNITS } from "../../constants/ui";
import { formatMoney } from "../../utils/format";

export function ProductModal({
  open,
  loading,
  form,
  setForm,
  onSubmit,
  onClose,
  error,
  categories,
  suppliers,
  openCreateSupplierModal,
}) {
  if (!open) return null;
  const retail = Number(form.retailPrice) || 0;
  const pieceQty = Number(form.pieceQtyPerBase) || 0;
  const suggestedPiecePrice = pieceQty > 0 ? Math.round(retail / pieceQty) : 0;
  const totalPurchaseCost =
    (Number(form.purchasePrice) || 0) * (Number(form.quantity) || 0);
  const debtAmount = Math.max(
    0,
    totalPurchaseCost - (Number(form.paidAmount) || 0),
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{form.id ? "Mahsulotni edit" : "Yangi mahsulot yaratish"}</h3>
        <form className="modal-form" onSubmit={onSubmit}>
          <p className="modal-subtitle">Asosiy ma'lumotlar</p>
          <label>
            Mahsulot nomi
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </label>
          <label>
            Modeli
            <input
              value={form.model}
              onChange={(e) =>
                setForm((p) => ({ ...p, model: e.target.value }))
              }
              required
            />
          </label>
          <label>
            Birligi
            <select
              value={form.unit}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  unit: e.target.value,
                  ...(e.target.value === "qop"
                    ? {}
                    : {
                        allowPieceSale: false,
                        pieceUnit: "kg",
                        pieceQtyPerBase: "",
                        piecePrice: "",
                      }),
                }))
              }
            >
              {PRODUCT_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </label>
          <label>
            Kategoriya
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm((p) => ({ ...p, categoryId: e.target.value }))
              }
              required
            >
              <option value="">Tanlang</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Yetkazib beruvchi
            <select
              value={form.supplierId}
              onChange={(e) =>
                setForm((p) => ({ ...p, supplierId: e.target.value }))
              }
              required
            >
              <option value="">Tanlang</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="ghost"
            onClick={openCreateSupplierModal}
          >
            + Yangi yetkazib beruvchi
          </button>
          <label>
            Miqdori
            <input
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={(e) =>
                setForm((p) => ({ ...p, quantity: e.target.value }))
              }
              required
            />
          </label>

          <p className="modal-subtitle">Narxlar</p>
          <label>
            Kelish narxi
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.purchasePrice}
              onChange={(e) =>
                setForm((p) => ({ ...p, purchasePrice: e.target.value }))
              }
              required
            />
          </label>
          <label>
            {form.unit === "qop"
              ? "Qop narxi (chakana)"
              : "Dona narxi (chakana)"}
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.retailPrice}
              onChange={(e) =>
                setForm((p) => ({ ...p, retailPrice: e.target.value }))
              }
              required
            />
          </label>
          <label>
            {form.unit === "qop" ? "Qop narxi (optom)" : "Optom narxi"}
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.wholesalePrice}
              onChange={(e) =>
                setForm((p) => ({ ...p, wholesalePrice: e.target.value }))
              }
              required
            />
          </label>
          <label>
            To'lov turi
            <select
              value={form.paymentType}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  paymentType: e.target.value,
                  paidAmount:
                    e.target.value === "naqd"
                      ? String(totalPurchaseCost)
                      : e.target.value === "qarz"
                        ? "0"
                        : p.paidAmount,
                }))
              }
            >
              <option value="naqd">Naqd</option>
              <option value="qisman">Qisman</option>
              <option value="qarz">Qarz</option>
            </select>
          </label>
          {form.paymentType === "qisman" ? (
            <label>
              Hozir to'langan summa
              <input
                type="number"
                min="0"
                max={totalPurchaseCost}
                step="0.01"
                value={form.paidAmount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, paidAmount: e.target.value }))
                }
                required
              />
            </label>
          ) : null}
          <p className="hint">
            Umumiy kelish summasi: {formatMoney(totalPurchaseCost)} so'm
          </p>
          <p className="hint">Joriy qarz: {formatMoney(debtAmount)} so'm</p>
          {form.unit === "qop" ? (
            <div className="piece-box">
              <label className="check-line">
                <input
                  type="checkbox"
                  checked={form.allowPieceSale}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, allowPieceSale: e.target.checked }))
                  }
                />
                Qopni kg bo'lib sotish
              </label>
              {form.allowPieceSale ? (
                <>
                  <label>
                    1 qop ichida nechta {form.pieceUnit}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.pieceQtyPerBase}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          pieceQtyPerBase: e.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                  <p className="hint">
                    Tavsiya (qop narxidan): {suggestedPiecePrice || 0} so'm/
                    {form.pieceUnit}
                  </p>
                  <label>
                    1 {form.pieceUnit} sotish narxi
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.piecePrice}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, piecePrice: e.target.value }))
                      }
                      required
                    />
                  </label>
                </>
              ) : null}
            </div>
          ) : null}
          {error ? <p className="error-text">{error}</p> : null}
          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={
                loading || categories.length === 0 || suppliers.length === 0
              }
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
