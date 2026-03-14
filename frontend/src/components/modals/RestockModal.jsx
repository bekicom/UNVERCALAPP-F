import { formatMoney } from "../../utils/format";
import { getQuantityInputMode, getQuantityStep } from "../../constants/ui";

function normalizeDecimalInput(value) {
  return String(value ?? "")
    .replace(/,/g, ".")
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*?)\./g, "$1");
}

function normalizeDecimalInput(value) {
  return String(value ?? "")
    .replace(/,/g, ".")
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*?)\./g, "$1");
}

export function RestockModal({ open, loading, form, setForm, onSubmit, onClose, error, suppliers, product, usdRate = 12171 }) {
  if (!open || !product) return null;

  const quantityStep = getQuantityStep(product.unit);
  const quantityInputMode = getQuantityInputMode(product.unit);
  const requiresNewPrices = form.pricingMode !== "keep_old";
  const showPiecePrice = product.unit === "qop" && product.allowPieceSale && requiresNewPrices;
  const totalInput = (Number(form.purchasePrice) || 0) * (Number(form.quantity) || 0);
  const totalUzs = form.priceCurrency === "usd"
    ? totalInput * Number(usdRate || 0)
    : totalInput;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Kirim: {product.name} ({product.model})</h3>
        <form className="modal-form" onSubmit={onSubmit}>
          <label>
            Yetkazib beruvchi
            <select value={form.supplierId} onChange={(e) => setForm((p) => ({ ...p, supplierId: e.target.value }))} required>
              <option value="">Tanlang</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label>
            Kelgan miqdor
            <input
              type="number"
              min="0"
              step={quantityStep}
              inputMode={quantityInputMode}
              value={form.quantity}
              onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
              required
            />
          </label>
          <label>
            Valyuta
            <select value={form.priceCurrency || "uzs"} onChange={(e) => setForm((p) => ({ ...p, priceCurrency: e.target.value }))}>
              <option value="uzs">So'm</option>
              <option value="usd">USD ($)</option>
            </select>
          </label>
          <label>
            Kelish narxi (1 birlik)
            <input type="text" inputMode="decimal" autoComplete="off" value={form.purchasePrice} onChange={(e) => setForm((p) => ({ ...p, purchasePrice: normalizeDecimalInput(e.target.value) }))} required />
          </label>
          <p className="hint">
            Umumiy kirim: {formatMoney(totalInput)} {form.priceCurrency === "usd" ? "$" : "so'm"}
          </p>
          {form.priceCurrency === "usd" ? (
            <p className="hint">So'mda: {formatMoney(totalUzs)} so'm</p>
          ) : null}
          <label>
            Narx strategiyasi
            <select value={form.pricingMode} onChange={(e) => setForm((p) => ({ ...p, pricingMode: e.target.value }))}>
              <option value="keep_old">Eski narxni saqlash</option>
              <option value="replace_all">Yangi narxni qo'llash</option>
              <option value="average">Eski+yangi o'rtacha narx</option>
            </select>
          </label>

          {requiresNewPrices ? (
            <>
              <label>
                Yangi dona/chakana narx
                <input type="text" inputMode="decimal" autoComplete="off" value={form.retailPrice} onChange={(e) => setForm((p) => ({ ...p, retailPrice: normalizeDecimalInput(e.target.value) }))} required />
              </label>
              <label>
                Yangi optom narx
                <input type="text" inputMode="decimal" autoComplete="off" value={form.wholesalePrice} onChange={(e) => setForm((p) => ({ ...p, wholesalePrice: normalizeDecimalInput(e.target.value) }))} required />
              </label>
              {showPiecePrice ? (
                <label>
                  Yangi {product.pieceUnit || "kg"} narxi
                  <input type="text" inputMode="decimal" autoComplete="off" value={form.piecePrice} onChange={(e) => setForm((p) => ({ ...p, piecePrice: normalizeDecimalInput(e.target.value) }))} required />
                </label>
              ) : null}
            </>
          ) : null}

          <label>
            To'lov turi
            <select value={form.paymentType} onChange={(e) => setForm((p) => ({ ...p, paymentType: e.target.value }))}>
              <option value="naqd">Naqd</option>
              <option value="qisman">Qisman</option>
              <option value="qarz">Qarz</option>
            </select>
          </label>
          {form.paymentType === "qisman" ? (
            <label>
              To'langan summa
              <input type="text" inputMode="decimal" autoComplete="off" value={form.paidAmount} onChange={(e) => setForm((p) => ({ ...p, paidAmount: normalizeDecimalInput(e.target.value) }))} required />
            </label>
          ) : null}
          {error ? <p className="error-text">{error}</p> : null}
          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>Bekor qilish</button>
            <button type="submit" disabled={loading}>{loading ? "Saqlanmoqda..." : "Kirimni saqlash"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
