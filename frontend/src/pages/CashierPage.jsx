import { useMemo, useState } from "react";
import {
  useCreateSaleMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetSalesQuery
} from "../app/api/baseApi";
import { formatMoney, getCategoryId } from "../utils/format";

function getStepByUnit(unit) {
  return String(unit || "").toLowerCase() === "kg" ? 0.1 : 1;
}

function formatSaleTime(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

function openPrintCheck(sale) {
  const rows = (sale?.items || []).map((it) => `
    <tr>
      <td>${it.productName}</td>
      <td>${it.quantity} ${it.unit}</td>
      <td>${formatMoney(it.unitPrice)}</td>
      <td>${formatMoney(it.lineTotal)}</td>
    </tr>
  `).join("");

  const html = `
    <html>
      <head>
        <title>Chek</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 12px; }
          h3 { margin: 0 0 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border-bottom: 1px solid #ddd; text-align: left; padding: 6px 4px; font-size: 12px; }
          .total { margin-top: 10px; font-weight: bold; font-size: 16px; }
        </style>
      </head>
      <body>
        <h3>UY-DOKON CHEK</h3>
        <div>Sana: ${formatSaleTime(sale?.createdAt)}</div>
        <div>Kassir: ${sale?.cashierUsername || "-"}</div>
        <div>To'lov: ${sale?.paymentType || "-"}</div>
        <table>
          <thead>
            <tr><th>Mahsulot</th><th>Miqdor</th><th>Narx</th><th>Summa</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="total">Jami: ${formatMoney(sale?.totalAmount || 0)} so'm</div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=420,height=700");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function CashierPage({ user, onLogout }) {
  const { data: categoriesRes = {}, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: productsRes = {}, isLoading: productsLoading } = useGetProductsQuery();
  const { data: salesRes = {}, isLoading: salesLoading } = useGetSalesQuery({ limit: 120 });
  const [createSale, { isLoading: creatingSale }] = useCreateSaleMutation();

  const categories = categoriesRes.categories || [];
  const products = (productsRes.products || []).filter((item) => Number(item?.quantity || 0) > 0);
  const sales = salesRes.sales || [];

  const stockMap = useMemo(
    () => Object.fromEntries(products.map((p) => [String(p._id), Number(p.quantity) || 0])),
    [products]
  );

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [mixedPayment, setMixedPayment] = useState({ cash: "", card: "", click: "" });
  const [qtyEditor, setQtyEditor] = useState({ id: "", value: "" });
  const [saleError, setSaleError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      const categoryOk = activeCategory === "all" || getCategoryId(product) === activeCategory;
      const searchOk = !q || [product.name, product.model].join(" ").toLowerCase().includes(q);
      return categoryOk && searchOk;
    });
  }, [products, activeCategory, search]);

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0),
    [cart]
  );

  const mixedSum = useMemo(() => {
    const cash = Number(mixedPayment.cash || 0);
    const card = Number(mixedPayment.card || 0);
    const click = Number(mixedPayment.click || 0);
    return cash + card + click;
  }, [mixedPayment]);

  const canSell = cart.length > 0
    && totalAmount > 0
    && !!paymentType
    && !creatingSale
    && (paymentType !== "mixed" || (mixedSum > 0 && Math.abs(mixedSum - totalAmount) < 0.001));

  const addToCart = (product) => {
    const unit = String(product.unit || "dona").toLowerCase();
    const currentStock = Number(stockMap[String(product._id)] || 0);
    if (currentStock <= 0) return;

    const defaultQty = unit === "kg" ? 0 : Math.min(1, currentStock);
    setCart((prev) => {
      const found = prev.find((row) => row.id === product._id);
      if (found) return prev;
      return [
        ...prev,
        {
          id: product._id,
          name: product.name,
          unit,
          price: Number(product.retailPrice || 0),
          qty: defaultQty
        }
      ];
    });
  };

  const updateCartQty = (id, nextQty) => {
    const parsed = Number(nextQty);
    const safeQty = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    const maxStock = Number(stockMap[String(id)]);
    const clampedQty = Number.isFinite(maxStock) ? Math.min(safeQty, maxStock) : safeQty;
    setCart((prev) => prev.map((row) => (row.id === id ? { ...row, qty: clampedQty } : row)));
  };

  const openQtyKeyboard = (row) => {
    setQtyEditor({ id: row.id, value: row.qty > 0 ? String(row.qty) : "" });
  };

  const closeQtyKeyboard = () => {
    setQtyEditor({ id: "", value: "" });
  };

  const handleQtyKey = (key) => {
    if (!qtyEditor.id) return;
    setQtyEditor((prev) => {
      let next = prev.value || "";
      if (key === "backspace") {
        next = next.slice(0, -1);
      } else if (key === "clear") {
        next = "";
      } else if (key === ".") {
        if (!next.includes(".")) next = next ? `${next}.` : "0.";
      } else {
        next += key;
      }

      const parsed = Number(next);
      if (next === "") {
        updateCartQty(prev.id, 0);
      } else if (Number.isFinite(parsed)) {
        updateCartQty(prev.id, parsed);
      }
      return { ...prev, value: next };
    });
  };

  const resetSale = () => {
    setCart([]);
    setPaymentType("");
    setMixedPayment({ cash: "", card: "", click: "" });
    setSaleError("");
    closeQtyKeyboard();
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((row) => row.id !== id));
    setQtyEditor((prev) => (prev.id === id ? { id: "", value: "" } : prev));
  };

  const applyHalfCashHalfCard = () => {
    const half = totalAmount / 2;
    setMixedPayment({
      cash: String(Math.floor(half)),
      card: String(Math.ceil(half)),
      click: "0"
    });
  };

  const completeSale = async () => {
    setSaleError("");

    const sellableItems = cart
      .filter((item) => Number(item.qty) > 0)
      .map((item) => ({ productId: item.id, quantity: Number(item.qty) }));

    if (sellableItems.length < 1) {
      setSaleError("Kamida bitta mahsulot miqdori 0 dan katta bo'lsin");
      return;
    }

    const overflow = sellableItems.find((it) => Number(it.quantity) > Number(stockMap[String(it.productId)] || 0));
    if (overflow) {
      setSaleError("Ba'zi mahsulotlarda qoldiq yetarli emas. Miqdorni kamaytiring.");
      return;
    }

    const payments = paymentType === "mixed"
      ? {
        cash: Number(mixedPayment.cash || 0),
        card: Number(mixedPayment.card || 0),
        click: Number(mixedPayment.click || 0)
      }
      : paymentType === "cash"
        ? { cash: totalAmount, card: 0, click: 0 }
        : paymentType === "card"
          ? { cash: 0, card: totalAmount, click: 0 }
          : { cash: 0, card: 0, click: totalAmount };

    try {
      const result = await createSale({
        items: sellableItems,
        paymentType,
        payments
      }).unwrap();
      if (window.confirm("Chek chiqsinmi?")) {
        openPrintCheck(result?.sale);
      }
      resetSale();
    } catch (err) {
      setSaleError(err?.data?.message || err?.message || "Sotuvda xatolik yuz berdi");
    }
  };

  return (
    <main className="cashier-page">
      <aside className="cashier-left">
        <div className="cashier-brand">
          <p className="badge">KASSA</p>
          <h2>Retail POS</h2>
          <p className="hint">{user?.username}</p>
        </div>
        <div className="cashier-cats">
          <button
            type="button"
            className={`cashier-cat-btn ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            Barchasi
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat._id}
              className={`cashier-cat-btn ${activeCategory === cat._id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button type="button" className="ghost logout-btn" onClick={onLogout}>Chiqish</button>
      </aside>

      <section className="cashier-center">
        <div className="cashier-toolbar">
          <input
            className="cashier-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mahsulot nomi bo'yicha qidirish"
          />
          <p className="hint">
            {categoriesLoading || productsLoading ? "Yuklanmoqda..." : `${filteredProducts.length} ta mahsulot`}
          </p>
        </div>

        <div className="cashier-product-grid">
          {filteredProducts.map((product) => (
            <button
              type="button"
              key={product._id}
              className="cashier-product-card"
              onClick={() => addToCart(product)}
            >
              <h3>{product.name}</h3>
              <p>{product.model || "-"}</p>
              <div className="cashier-card-foot">
                <span>{formatMoney(product.retailPrice)} so'm</span>
                <span>Qoldiq: {formatMoney(product.quantity)} {product.unit || "dona"}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <aside className="cashier-right">
        <h3>Savat</h3>
        <div className="cashier-cart-table">
          <table>
            <colgroup>
              <col className="cashier-col-product" />
              <col className="cashier-col-price" />
              <col className="cashier-col-qty" />
              <col className="cashier-col-sum" />
              <col className="cashier-col-del" />
            </colgroup>
            <thead>
              <tr>
                <th>Mahsulot</th>
                <th>Narx</th>
                <th>Miqdor</th>
                <th>Summa</th>
                <th>O'chirish</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td colSpan={5}>Savat bo'sh</td>
                </tr>
              ) : cart.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{formatMoney(row.price)}</td>
                  <td>
                    <div className="cashier-qty">
                      <button type="button" onClick={() => updateCartQty(row.id, Number((row.qty - getStepByUnit(row.unit)).toFixed(2)))}>-</button>
                      <input
                        value={qtyEditor.id === row.id ? qtyEditor.value : (row.qty > 0 ? row.qty : "")}
                        readOnly
                        onClick={() => openQtyKeyboard(row)}
                        placeholder="0"
                      />
                      <button type="button" onClick={() => updateCartQty(row.id, Number((row.qty + getStepByUnit(row.unit)).toFixed(2)))}>+</button>
                      <span className="cashier-qty-unit">{row.unit}</span>
                    </div>
                  </td>
                  <td>{formatMoney(row.price * row.qty)}</td>
                  <td>
                    <button type="button" className="cashier-del-btn" onClick={() => removeFromCart(row.id)}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cashier-pay">
          <p>To'lov turi</p>
          <div className="cashier-pay-types">
            <button type="button" className={paymentType === "cash" ? "active" : ""} onClick={() => setPaymentType("cash")}>Naqd</button>
            <button type="button" className={paymentType === "card" ? "active" : ""} onClick={() => setPaymentType("card")}>Karta</button>
            <button type="button" className={paymentType === "click" ? "active" : ""} onClick={() => setPaymentType("click")}>Click</button>
            <button type="button" className={paymentType === "mixed" ? "active" : ""} onClick={() => setPaymentType("mixed")}>Aralash</button>
          </div>

          {paymentType === "mixed" ? (
            <div className="cashier-mix-box">
              <div className="cashier-mix-head">
                <span>Yarmi naqd + yarmi karta</span>
                <button type="button" onClick={applyHalfCashHalfCard}>Auto bo'lish</button>
              </div>
              <div className="cashier-mix-grid">
                <label>Naqd<input value={mixedPayment.cash} onChange={(e) => setMixedPayment((p) => ({ ...p, cash: e.target.value }))} /></label>
                <label>Karta<input value={mixedPayment.card} onChange={(e) => setMixedPayment((p) => ({ ...p, card: e.target.value }))} /></label>
                <label>Click<input value={mixedPayment.click} onChange={(e) => setMixedPayment((p) => ({ ...p, click: e.target.value }))} /></label>
              </div>
              <p className={`cashier-mix-total ${Math.abs(mixedSum - totalAmount) < 0.001 ? "ok" : "bad"}`}>
                Kiritilgan: {formatMoney(mixedSum)} / Jami: {formatMoney(totalAmount)}
              </p>
            </div>
          ) : null}
        </div>

        <div className="cashier-total">
          <span>Jami</span>
          <strong>{formatMoney(totalAmount)} so'm</strong>
        </div>
        {saleError ? <p className="error-text cashier-error">{saleError}</p> : null}
        <button type="button" className="cashier-sell-btn" disabled={!canSell} onClick={completeSale}>
          {creatingSale ? "Sotuv saqlanmoqda..." : "Sotuv qilish"}
        </button>
        <button type="button" className="ghost cashier-history-btn" onClick={() => setHistoryOpen(true)}>
          Sotuv tarixi
        </button>
      </aside>

      {qtyEditor.id ? (
        <div className="qty-keypad-overlay" onClick={closeQtyKeyboard}>
          <div className="qty-keypad" onClick={(e) => e.stopPropagation()}>
            <div className="qty-keypad-head">
              <strong>Miqdor</strong>
              <button type="button" className="ghost" onClick={closeQtyKeyboard}>Yopish</button>
            </div>
            <div className="qty-keypad-display">{qtyEditor.value || "0"}</div>
            <div className="qty-keypad-grid">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"].map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleQtyKey(key)}
                  className={key === "backspace" ? "ghost" : ""}
                >
                  {key === "backspace" ? "⌫" : key}
                </button>
              ))}
            </div>
            <div className="qty-keypad-actions">
              <button type="button" className="ghost" onClick={() => handleQtyKey("clear")}>Tozalash</button>
              <button type="button" onClick={closeQtyKeyboard}>Tayyor</button>
            </div>
          </div>
        </div>
      ) : null}

      {historyOpen ? (
        <div className="modal-backdrop" onClick={() => setHistoryOpen(false)}>
          <section className="modal-card modal-wide" onClick={(e) => e.stopPropagation()}>
            <h3>Sotuv Tarixi</h3>
            <div className="sales-history-wrap">
              <table className="sales-history-table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Kassir</th>
                    <th>Mahsulotlar</th>
                    <th>To'lov</th>
                    <th>Summa</th>
                  </tr>
                </thead>
                <tbody>
                  {salesLoading ? (
                    <tr><td colSpan={5}>Yuklanmoqda...</td></tr>
                  ) : sales.length < 1 ? (
                    <tr><td colSpan={5}>Sotuvlar hali yo'q</td></tr>
                  ) : sales.map((sale) => (
                    <tr key={sale._id}>
                      <td>{formatSaleTime(sale.createdAt)}</td>
                      <td>{sale.cashierUsername}</td>
                      <td>{sale.items?.map((it) => `${it.productName} (${it.quantity} ${it.unit})`).join(", ")}</td>
                      <td>{sale.paymentType}</td>
                      <td>{formatMoney(sale.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-actions">
              <button type="button" className="ghost" onClick={() => setHistoryOpen(false)}>Yopish</button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
