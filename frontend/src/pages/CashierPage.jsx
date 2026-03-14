import { useEffect, useMemo, useState } from "react";
import {
  useCreateSaleMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetSalesQuery,
  useGetSettingsQuery,
  useLazySearchCustomersQuery,
  useReturnSaleMutation
} from "../app/api/baseApi";
import { getQuantityInputMode, getQuantityMin, getQuantityStep } from "../constants/ui";
import { Icon } from "../components/Icon";
import { formatDisplayMoney, formatMoney, getCategoryId } from "../utils/format";
<<<<<<< HEAD
=======

function getStepByUnit(unit) {
  return String(unit || "").toLowerCase() === "kg" ? 0.1 : 1;
}
>>>>>>> e64c8a94615163a6ef7cf6ceb874e582ca477756

function formatSaleTime(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

function paymentLabel(value) {
  if (value === "cash") return "Naqd";
  if (value === "card") return "Karta";
  if (value === "click") return "Click";
  if (value === "mixed") return "Aralash";
  if (value === "debt") return "Qarzga";
  if (value === "debt_payment") return "Qarz to'lovi";
  return value || "-";
}

function normalizePriceInput(value) {
  return String(value ?? "")
    .replace(/,/g, ".")
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*?)\./g, "$1");
}

function getUnitPriceByType(product, priceType) {
  if (priceType === "wholesale") return Number(product?.wholesalePrice || 0);
  return Number(product?.retailPrice || 0);
}

function toDisplayAmount(amount, displayCurrency, usdRate) {
  const numericAmount = Number(amount || 0);
  const rate = Number(usdRate || 0);
  if (displayCurrency === "usd" && rate > 0) {
    return Math.round((numericAmount / rate) * 100) / 100;
  }
  return numericAmount;
}

function toBaseAmount(amount, displayCurrency, usdRate) {
  const numericAmount = Number(amount || 0);
  const rate = Number(usdRate || 0);
  if (displayCurrency === "usd" && rate > 0) {
    return Math.round(numericAmount * rate * 100) / 100;
  }
  return numericAmount;
}

function openPrintCheck(sale, settings) {
  const receiptTitle = settings?.receipt?.title || "CHEK";
  const receiptFooter = settings?.receipt?.footer || "Xaridingiz uchun rahmat!";
  const logoUrl = settings?.receipt?.logoUrl || "";
  const displayCurrency = settings?.displayCurrency === "usd" ? "usd" : "uzs";
  const usdRate = Number(settings?.usdRate || 12171);
  const receiptFields = settings?.receipt?.fields || {};
  const showDate = receiptFields.showDate !== false;
  const showCashier = receiptFields.showCashier !== false;
  const showPaymentType = receiptFields.showPaymentType !== false;
  const showCustomer = receiptFields.showCustomer !== false;
  const showItemsTable = receiptFields.showItemsTable !== false;
  const showItemUnitPrice = receiptFields.showItemUnitPrice !== false;
  const showItemLineTotal = receiptFields.showItemLineTotal !== false;
  const showTotal = receiptFields.showTotal !== false;
  const showFooter = receiptFields.showFooter !== false;
  const rows = (sale?.items || []).map((it) => `
    <tr>
      <td>${it.productName}</td>
      <td>${it.quantity} ${it.unit}</td>
      ${showItemUnitPrice ? `<td>${formatDisplayMoney(it.unitPrice, displayCurrency, usdRate)}</td>` : ""}
      ${showItemLineTotal ? `<td>${formatDisplayMoney(it.lineTotal, displayCurrency, usdRate)}</td>` : ""}
    </tr>
  `).join("");

  const html = `
    <html>
      <head>
        <title>Chek</title>
        <style>
          @page { size: 80mm auto; margin: 4mm; }
          html, body { width: 80mm; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; padding: 0; font-size: 13px; color: #24262b; background: #f3f3f4; }
          .paper { background: #f3f3f4; border: 1px solid #d6d7db; border-radius: 8px; padding: 12px; box-sizing: border-box; }
          h3 { margin: 0 0 14px; text-align: center; font-size: 18px; letter-spacing: 0.8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 6px; table-layout: fixed; }
          th, td { border-bottom: 1px solid #c8cad0; text-align: left; padding: 6px 0; font-size: 12px; }
          th:nth-child(1), td:nth-child(1) { width: 46%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          th:nth-child(2), td:nth-child(2) { width: 14%; text-align: right; }
          th:nth-child(3), td:nth-child(3), th:nth-child(4), td:nth-child(4) { width: 20%; text-align: right; }
          .sep { border-bottom: 1px solid #c8cad0; margin: 10px 0; }
          .total { margin-top: 8px; font-weight: 700; font-size: 20px; line-height: 1.15; }
          .footer { margin-top: 8px; font-size: 13px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="paper">
        ${logoUrl ? `<div><img src="${logoUrl}" alt="logo" style="max-height:56px; max-width:200px; object-fit:contain;" /></div>` : ""}
        <h3>${receiptTitle}</h3>
        ${showDate ? `<div>Sana: ${formatSaleTime(sale?.createdAt)}</div>` : ""}
        ${showCashier ? `<div>Kassir: ${sale?.cashierUsername || "-"}</div>` : ""}
        ${showPaymentType ? `<div>To'lov: ${paymentLabel(sale?.paymentType)}</div>` : ""}
        ${showCustomer && sale?.customerName ? `<div>Mijoz: ${sale.customerName} (${sale.customerPhone || "-"})</div>` : ""}
        <div class="sep"></div>
        ${showItemsTable ? `<table>
          <thead>
            <tr>
              <th>Mahsulot</th>
              <th>Miqdor</th>
              ${showItemUnitPrice ? "<th>Narx</th>" : ""}
              ${showItemLineTotal ? "<th>Summa</th>" : ""}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>` : ""}
        <div class="sep"></div>
        ${showTotal ? `<div class="total">Jami: ${formatDisplayMoney(sale?.totalAmount || 0, displayCurrency, usdRate)}</div>` : ""}
        <div class="sep"></div>
        ${showFooter ? `<div class="footer">${receiptFooter}</div>` : ""}
        </div>
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

const SEARCH_KEY_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "'"],
  ["z", "x", "c", "v", "b", "n", "m", "space", "backspace"]
];

export function CashierPage({ user, onLogout }) {
  const { data: settingsRes } = useGetSettingsQuery();
  const { data: categoriesRes = {}, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: productsRes = {}, isLoading: productsLoading } = useGetProductsQuery();
  const { data: salesRes = {}, isLoading: salesLoading, refetch: refetchSales } = useGetSalesQuery({ limit: 120 });
  const [createSale, { isLoading: creatingSale }] = useCreateSaleMutation();
  const [returnSale, { isLoading: returningSale }] = useReturnSaleMutation();
  const [searchCustomers, { isFetching: customersSearching }] = useLazySearchCustomersQuery();

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
  const [mixedPayment, setMixedPayment] = useState({ cash: "0", card: "0", lastEdited: "cash" });
  const [qtyEditor, setQtyEditor] = useState({ id: "", value: "" });
  const [searchKeyboardOpen, setSearchKeyboardOpen] = useState(false);
  const [saleError, setSaleError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnError, setReturnError] = useState("");
  const [debtCustomerOpen, setDebtCustomerOpen] = useState(false);
  const [debtCustomer, setDebtCustomer] = useState({ fullName: "", phone: "", address: "" });
  const [debtCustomerMode, setDebtCustomerMode] = useState("existing");
  const [selectedDebtCustomerId, setSelectedDebtCustomerId] = useState("");
  const [debtCustomerSearch, setDebtCustomerSearch] = useState("");
  const [debtCustomerResults, setDebtCustomerResults] = useState([]);
  const [displayCurrency, setDisplayCurrency] = useState(() => {
    if (typeof window === "undefined") return "uzs";
    const saved = window.localStorage.getItem("displayCurrency");
    return saved === "usd" ? "usd" : "uzs";
  });
  const [returnForm, setReturnForm] = useState({
    saleId: "",
    productId: "",
    productName: "",
    unit: "dona",
    unitPrice: 0,
    soldQty: 0,
    leftQty: 0,
    qty: "",
    paymentType: "cash",
    salePayments: { cash: 0, card: 0, click: 0 },
    saleDebt: 0,
    mixed: { cash: "", card: "", click: "" }
  });
  const keyboardEnabled = settingsRes?.settings?.keyboardEnabled !== false;
  const usdRate = Number(settingsRes?.settings?.usdRate || 12171);
  const formatCurrency = (amount) => formatDisplayMoney(amount, displayCurrency, usdRate);

  useEffect(() => {
    const nextCurrency = settingsRes?.settings?.displayCurrency === "usd" ? "usd" : null;
    const savedCurrency = typeof window !== "undefined" ? window.localStorage.getItem("displayCurrency") : null;
    const resolvedCurrency = nextCurrency || (savedCurrency === "usd" ? "usd" : "uzs");
    setDisplayCurrency(resolvedCurrency);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("displayCurrency", resolvedCurrency);
    }
  }, [settingsRes]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      const categoryOk = q ? true : (activeCategory === "all" || getCategoryId(product) === activeCategory);
      const searchOk = !q || [product.name, product.model].join(" ").toLowerCase().includes(q);
      return categoryOk && searchOk;
    });
  }, [products, activeCategory, search]);

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0),
    [cart]
  );
  const totalAmountDisplay = useMemo(
    () => toDisplayAmount(totalAmount, displayCurrency, usdRate),
    [totalAmount, displayCurrency, usdRate]
  );

  const mixedCashAmount = useMemo(() => {
    const cash = Number(mixedPayment.cash || 0);
    if (!Number.isFinite(cash) || cash < 0) return 0;
    return Math.min(cash, totalAmountDisplay);
  }, [mixedPayment.cash, totalAmountDisplay]);

  const mixedCardAmount = useMemo(() => {
    const card = Number(mixedPayment.card || 0);
    if (!Number.isFinite(card) || card < 0) return 0;
    return Math.min(card, totalAmountDisplay);
  }, [mixedPayment.card, totalAmountDisplay]);

  const mixedSum = useMemo(
    () => Number((mixedCashAmount + mixedCardAmount).toFixed(2)),
    [mixedCashAmount, mixedCardAmount]
  );

  const returnQtyNum = Number(returnForm.qty || 0);
  const returnTotal = useMemo(
    () => Number.isFinite(returnQtyNum) && returnQtyNum > 0
      ? Number(returnForm.unitPrice || 0) * returnQtyNum
      : 0,
    [returnQtyNum, returnForm.unitPrice]
  );
  const returnMixedSum = useMemo(() => {
    const cash = Number(returnForm.mixed.cash || 0);
    const card = Number(returnForm.mixed.card || 0);
    const click = Number(returnForm.mixed.click || 0);
    return cash + card + click;
  }, [returnForm.mixed]);

  const canSell = cart.length > 0
    && totalAmount > 0
    && !!paymentType
    && !creatingSale
    && (paymentType !== "debt" || (!!debtCustomer.fullName.trim() && !!debtCustomer.phone.trim() && !!debtCustomer.address.trim()))
    && (paymentType !== "mixed" || (mixedSum > 0 && Math.abs(mixedSum - totalAmountDisplay) < 0.001));

  const handlePaymentTypeSelect = (type) => {
    setPaymentType(type);
    if (type === "debt") {
      setDebtCustomerMode("existing");
      setSelectedDebtCustomerId("");
      setDebtCustomerSearch("");
      setDebtCustomerOpen(true);
    }
  };

  useEffect(() => {
    if (!debtCustomerOpen || debtCustomerMode !== "existing") return;
    const q = debtCustomerSearch.trim();
    if (!q) {
      setDebtCustomerResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const data = await searchCustomers({ q }).unwrap();
        setDebtCustomerResults(data?.customers || []);
      } catch {
        setDebtCustomerResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [debtCustomerOpen, debtCustomerMode, debtCustomerSearch, searchCustomers]);

  const handleMixedCashChange = (rawValue) => {
    const parsed = Number(rawValue || 0);
    const safeValue = Number.isFinite(parsed) ? parsed : 0;
    const nextCash = Math.min(Math.max(0, safeValue), totalAmountDisplay);
    const nextCard = Math.max(0, Number((totalAmountDisplay - nextCash).toFixed(2)));
    setMixedPayment({
      cash: String(nextCash),
      card: String(nextCard),
      lastEdited: "cash"
    });
  };

  const handleMixedCardChange = (rawValue) => {
    const parsed = Number(rawValue || 0);
    const safeValue = Number.isFinite(parsed) ? parsed : 0;
    const nextCard = Math.min(Math.max(0, safeValue), totalAmountDisplay);
    const nextCash = Math.max(0, Number((totalAmountDisplay - nextCard).toFixed(2)));
    setMixedPayment({
      cash: String(nextCash),
      card: String(nextCard),
      lastEdited: "card"
    });
  };

  useEffect(() => {
    if (paymentType !== "mixed") return;

    if (mixedPayment.lastEdited === "cash") {
      const parsedCash = Number(mixedPayment.cash || 0);
      const safeCash = Math.min(Math.max(0, Number.isFinite(parsedCash) ? parsedCash : 0), totalAmountDisplay);
      const nextCard = Math.max(0, Number((totalAmountDisplay - safeCash).toFixed(2)));
      if (String(safeCash) !== mixedPayment.cash || String(nextCard) !== mixedPayment.card) {
        setMixedPayment({
          cash: String(safeCash),
          card: String(nextCard),
          lastEdited: "cash"
        });
      }
      return;
    }

    const parsedCard = Number(mixedPayment.card || 0);
    const safeCard = Math.min(Math.max(0, Number.isFinite(parsedCard) ? parsedCard : 0), totalAmountDisplay);
    const nextCash = Math.max(0, Number((totalAmountDisplay - safeCard).toFixed(2)));
    if (String(nextCash) !== mixedPayment.cash || String(safeCard) !== mixedPayment.card) {
      setMixedPayment({
        cash: String(nextCash),
        card: String(safeCard),
        lastEdited: "card"
      });
    }
  }, [totalAmountDisplay, paymentType, mixedPayment.cash, mixedPayment.card, mixedPayment.lastEdited]);

  const canReturn = useMemo(() => {
    if (!returnForm.saleId || !returnForm.productId) return false;
    if (!Number.isFinite(returnQtyNum) || returnQtyNum <= 0 || returnQtyNum > Number(returnForm.leftQty || 0)) return false;
    if (returnTotal <= 0) return false;

    const available = returnForm.salePayments;
    if (returnForm.paymentType === "cash") return returnTotal <= Number(available.cash || 0) + 0.001;
    if (returnForm.paymentType === "card") return returnTotal <= Number(available.card || 0) + 0.001;
    if (returnForm.paymentType === "click") return returnTotal <= Number(available.click || 0) + 0.001;
    if (returnForm.paymentType === "debt") return returnTotal <= Number(returnForm.saleDebt || 0) + 0.001;

    if (Math.abs(returnMixedSum - returnTotal) > 0.01) return false;
    if (Number(returnForm.mixed.cash || 0) > Number(available.cash || 0) + 0.001) return false;
    if (Number(returnForm.mixed.card || 0) > Number(available.card || 0) + 0.001) return false;
    if (Number(returnForm.mixed.click || 0) > Number(available.click || 0) + 0.001) return false;
    return true;
  }, [returnForm, returnMixedSum, returnQtyNum, returnTotal]);

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
          priceType: "retail",
          price: getUnitPriceByType(product, "retail"),
          retailPrice: Number(product.retailPrice || 0),
          wholesalePrice: Number(product.wholesalePrice || 0),
          qty: defaultQty
        }
      ];
    });
  };

  const updateCartPriceType = (id, priceType) => {
    setCart((prev) => prev.map((row) => (
      row.id === id
        ? {
            ...row,
            priceType,
            price: priceType === "wholesale" ? Number(row.wholesalePrice || 0) : Number(row.retailPrice || 0),
          }
        : row
    )));
  };

  const toggleCartPriceType = (id) => {
    setCart((prev) => prev.map((row) => {
      if (row.id !== id) return row;
      const nextPriceType = row.priceType === "wholesale" ? "retail" : "wholesale";
      return {
        ...row,
        priceType: nextPriceType,
        price: nextPriceType === "wholesale"
          ? Number(row.wholesalePrice || 0)
          : Number(row.retailPrice || 0),
      };
    }));
  };

  const updateCartPrice = (id, rawPrice) => {
    const normalized = normalizePriceInput(rawPrice);
    const parsed = Number(normalized);
    setCart((prev) => prev.map((row) => (
      row.id === id
        ? {
            ...row,
            price: normalized === "" ? 0 : (Number.isFinite(parsed) ? Math.max(0, toBaseAmount(parsed, displayCurrency, usdRate)) : row.price),
          }
        : row
    )));
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

  const handleSearchKey = (key) => {
    if (key === "backspace") {
      setSearch((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "clear") {
      setSearch("");
      return;
    }
    if (key === "space") {
      setSearch((prev) => `${prev} `);
      return;
    }
    setSearch((prev) => `${prev}${key}`);
  };

  const resetSale = () => {
    setCart([]);
    setPaymentType("");
    setMixedPayment({ cash: "0", card: "0", lastEdited: "cash" });
    setSaleError("");
    setDebtCustomerOpen(false);
    setDebtCustomerMode("existing");
    setSelectedDebtCustomerId("");
    setDebtCustomerSearch("");
    setDebtCustomerResults([]);
    setDebtCustomer({ fullName: "", phone: "", address: "" });
    closeQtyKeyboard();
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((row) => row.id !== id));
    setQtyEditor((prev) => (prev.id === id ? { id: "", value: "" } : prev));
  };

  const completeSale = async () => {
    setSaleError("");

    const sellableItems = cart
      .filter((item) => Number(item.qty) > 0)
      .map((item) => ({
        productId: item.id,
        quantity: Number(item.qty),
        priceType: item.priceType || "retail",
        unitPrice: Number(item.price || 0),
      }));

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
        cash: toBaseAmount(mixedCashAmount, displayCurrency, usdRate),
        card: toBaseAmount(mixedCardAmount, displayCurrency, usdRate),
        click: 0
      }
      : paymentType === "cash"
        ? { cash: totalAmount, card: 0, click: 0 }
        : paymentType === "card"
          ? { cash: 0, card: totalAmount, click: 0 }
          : paymentType === "click"
            ? { cash: 0, card: 0, click: totalAmount }
            : { cash: 0, card: 0, click: 0 };

    try {
      const result = await createSale({
        items: sellableItems,
        paymentType,
        payments,
        customer: paymentType === "debt" ? debtCustomer : undefined
      }).unwrap();
      await refetchSales();
      if (window.confirm("Chek chiqsinmi?")) {
        openPrintCheck(result?.sale, settingsRes?.settings);
      }
      resetSale();
    } catch (err) {
      setSaleError(err?.data?.message || err?.message || "Sotuvda xatolik yuz berdi");
    }
  };

  const leftQtyOf = (item) => {
    const sold = Number(item?.quantity || 0);
    const returned = Number(item?.returnedQuantity || 0);
    return Math.max(0, sold - returned);
  };

  const isSaleFullyReturned = (sale) => {
    const items = sale?.items || [];
    if (items.length < 1) return false;
    return items.every((item) => leftQtyOf(item) <= 0.0001);
  };

  const openReturnModal = (sale, item) => {
    const leftQty = leftQtyOf(item);
    const salePayments = {
      cash: Number(sale?.payments?.cash || 0),
      card: Number(sale?.payments?.card || 0),
      click: Number(sale?.payments?.click || 0)
    };
    const paymentType =
      sale.paymentType === "debt" ? "debt"
        : sale.paymentType === "cash" && salePayments.cash > 0 ? "cash"
        : sale.paymentType === "card" && salePayments.card > 0 ? "card"
          : sale.paymentType === "click" && salePayments.click > 0 ? "click"
            : salePayments.cash > 0 ? "cash"
              : salePayments.card > 0 ? "card"
                : salePayments.click > 0 ? "click"
                  : "mixed";

    setReturnError("");
    setReturnForm({
      saleId: sale._id,
      productId: String(item.productId),
      productName: item.productName,
      unit: item.unit || "dona",
      unitPrice: Number(item.unitPrice || 0),
      soldQty: Number(item.quantity || 0),
      leftQty,
      qty: "",
      paymentType,
      salePayments,
      saleDebt: Number(sale?.debtAmount || 0),
      mixed: { cash: "", card: "", click: "" }
    });
    setReturnModalOpen(true);
  };

  const closeReturnModal = () => {
    setReturnModalOpen(false);
    setReturnError("");
    setReturnForm({
      saleId: "",
      productId: "",
      productName: "",
      unit: "dona",
      unitPrice: 0,
      soldQty: 0,
      leftQty: 0,
      qty: "",
      paymentType: "cash",
      salePayments: { cash: 0, card: 0, click: 0 },
      saleDebt: 0,
      mixed: { cash: "", card: "", click: "" }
    });
  };

  const submitReturn = async (e) => {
    e.preventDefault();
    setReturnError("");

    if (!canReturn) {
      setReturnError("Vozvrat ma'lumotlarini to'g'ri kiriting");
      return;
    }

    const payments = returnForm.paymentType === "mixed"
      ? {
        cash: Number(returnForm.mixed.cash || 0),
        card: Number(returnForm.mixed.card || 0),
        click: Number(returnForm.mixed.click || 0)
      }
      : returnForm.paymentType === "cash"
        ? { cash: returnTotal, card: 0, click: 0 }
      : returnForm.paymentType === "card"
        ? { cash: 0, card: returnTotal, click: 0 }
        : returnForm.paymentType === "click"
          ? { cash: 0, card: 0, click: returnTotal }
          : { cash: 0, card: 0, click: 0 };

    try {
      await returnSale({
        id: returnForm.saleId,
        items: [{ productId: returnForm.productId, quantity: Number(returnForm.qty) }],
        paymentType: returnForm.paymentType,
        payments
      }).unwrap();
      await refetchSales();
      closeReturnModal();
    } catch (err) {
      setReturnError(err?.data?.message || err?.message || "Vozvratda xatolik yuz berdi");
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
            onFocus={() => { if (keyboardEnabled) setSearchKeyboardOpen(true); }}
            onClick={() => { if (keyboardEnabled) setSearchKeyboardOpen(true); }}
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
                <span>Chakana: {formatCurrency(product.retailPrice)}</span>
                <span>Optom: {formatCurrency(product.wholesalePrice)}</span>
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
                  <td>
                    <div className="cashier-price-box">
                      <input
                        className="cashier-price-input"
                        value={row.price > 0 ? String(toDisplayAmount(row.price, displayCurrency, usdRate)) : ""}
                        onChange={(e) => updateCartPrice(row.id, e.target.value)}
                        inputMode="decimal"
                        placeholder="Narx"
                      />
                      <div className="cashier-price-switch">
                        <button
                          type="button"
                          className={row.priceType === "wholesale" ? "active" : ""}
                          onClick={() => toggleCartPriceType(row.id)}
                        >
                          {row.priceType === "wholesale" ? "Optom" : "Dona"}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cashier-qty">
                      <button type="button" onClick={() => updateCartQty(row.id, Number((row.qty - Number(getQuantityStep(row.unit))).toFixed(2)))}>-</button>
                      <input
                        type="number"
<<<<<<< HEAD
                        inputMode={getQuantityInputMode(row.unit)}
                        min="0"
                        step={getQuantityStep(row.unit)}
=======
                        inputMode="decimal"
                        min="0"
                        step={getStepByUnit(row.unit)}
>>>>>>> e64c8a94615163a6ef7cf6ceb874e582ca477756
                        value={row.qty > 0 ? row.qty : ""}
                        onChange={(e) => {
                          const raw = String(e.target.value || "").replace(",", ".");
                          if (raw === "") {
                            updateCartQty(row.id, 0);
                            return;
                          }
                          const parsed = Number(raw);
                          if (Number.isFinite(parsed)) updateCartQty(row.id, parsed);
                        }}
                        placeholder="0"
                      />
                      <button type="button" onClick={() => updateCartQty(row.id, Number((row.qty + Number(getQuantityStep(row.unit))).toFixed(2)))}>+</button>
                      <span className="cashier-qty-unit">{row.unit}</span>
                    </div>
                  </td>
                  <td>{formatCurrency(row.price * row.qty)}</td>
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
            <button type="button" className={paymentType === "cash" ? "active" : ""} onClick={() => handlePaymentTypeSelect("cash")}><Icon name="cash" />Naqd</button>
            <button type="button" className={paymentType === "card" ? "active" : ""} onClick={() => handlePaymentTypeSelect("card")}><Icon name="wallet" />Karta</button>
            <button type="button" className={paymentType === "click" ? "active" : ""} onClick={() => handlePaymentTypeSelect("click")}><Icon name="download" />Click</button>
            <button type="button" className={paymentType === "mixed" ? "active" : ""} onClick={() => handlePaymentTypeSelect("mixed")}><Icon name="rotate" />Aralash</button>
            <button type="button" className={paymentType === "debt" ? "active" : ""} onClick={() => handlePaymentTypeSelect("debt")}><Icon name="user" />Qarzga</button>
          </div>

          {paymentType === "mixed" ? (
            <div className="cashier-mix-box">
              <div className="cashier-mix-head">
                <span>Qaysi biriga yozsangiz, ikkinchisi avtomatik hisoblanadi</span>
              </div>
              <div className="cashier-mix-grid">
                <label>Naqd<input value={mixedPayment.cash} onChange={(e) => handleMixedCashChange(e.target.value)} /></label>
                <label>Karta<input value={mixedPayment.card} onChange={(e) => handleMixedCardChange(e.target.value)} /></label>
              </div>
              <p className={`cashier-mix-total ${Math.abs(mixedSum - totalAmountDisplay) < 0.001 ? "ok" : "bad"}`}>
                Kiritilgan: {formatDisplayMoney(toBaseAmount(mixedSum, displayCurrency, usdRate), displayCurrency, usdRate)} / Jami: {formatCurrency(totalAmount)}
              </p>
            </div>
          ) : null}
          {paymentType === "debt" ? (
            <p className="hint">
              Mijoz: {debtCustomer.fullName || "-"} | {debtCustomer.phone || "-"}
              <button type="button" className="ghost" onClick={() => setDebtCustomerOpen(true)}> Mijoz tanlash </button>
            </p>
          ) : null}
        </div>

        <div className="cashier-total">
          <span>Jami</span>
          <strong>{formatCurrency(totalAmount)}</strong>
        </div>
        {saleError ? <p className="error-text cashier-error">{saleError}</p> : null}
        <button type="button" className="cashier-sell-btn" disabled={!canSell} onClick={completeSale}>
          {creatingSale ? "Sotuv saqlanmoqda..." : "Sotuv qilish"}
        </button>
        <button type="button" className="ghost cashier-history-btn" onClick={() => setHistoryOpen(true)}>
          Sotuv tarixi
        </button>
      </aside>

      {keyboardEnabled && qtyEditor.id ? (
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

      {keyboardEnabled && searchKeyboardOpen ? (
        <div className="qty-keypad-overlay" onClick={() => setSearchKeyboardOpen(false)}>
          <div className="search-keypad" onClick={(e) => e.stopPropagation()}>
            <div className="qty-keypad-head">
              <strong>Qidiruv Klaviaturasi</strong>
              <button type="button" className="ghost" onClick={() => setSearchKeyboardOpen(false)}>Yopish</button>
            </div>
            <div className="search-keypad-display">{search || " "}</div>
            <div className="search-keypad-rows">
              {SEARCH_KEY_ROWS.map((row, idx) => (
                <div className="search-keypad-row" key={idx}>
                  {row.map((key) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => handleSearchKey(key)}
                      className={key === "backspace" || key === "space" ? "ghost" : ""}
                    >
                      {key === "backspace" ? "⌫" : key === "space" ? "Bo'shliq" : key}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className="qty-keypad-actions">
              <button type="button" className="ghost" onClick={() => handleSearchKey("clear")}>Tozalash</button>
              <button type="button" onClick={() => setSearchKeyboardOpen(false)}>Tayyor</button>
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
                    <th>Mahsulotlar / Vozvrat</th>
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
                    <tr
                      key={sale._id}
                      className={isSaleFullyReturned(sale) ? "sales-history-row-returned" : ""}
                    >
                      <td>{formatSaleTime(sale.createdAt)}</td>
                      <td>{sale.cashierUsername}</td>
                      <td>
                        {sale.transactionType === "debt_payment" || sale.paymentType === "debt_payment" ? (
                          <div className="sales-history-products">
                            <div className="sales-history-product-line">
                              <span>Qarz to'lovi {sale.customerName ? `(${sale.customerName})` : ""}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="sales-history-products">
                            {isSaleFullyReturned(sale) ? (
                              <div className="sales-history-status">
                                <span className="badge sales-history-badge returned">Vozvrat qilindi</span>
                                <small>Mahsulot omborga qaytdi</small>
                              </div>
                            ) : null}
                            {(sale.items || []).map((it) => {
                              const leftQty = leftQtyOf(it);
                              const canItemReturn = leftQty > 0.0001;
                              return (
                                <div key={`${sale._id}-${String(it.productId)}`} className="sales-history-product-line">
                                  <span>
                                    {it.productName} ({formatMoney(leftQty)} / {formatMoney(it.quantity)} {it.unit})
                                  </span>
                                  {canItemReturn ? (
                                    <button
                                      type="button"
                                      className="ghost"
                                      onClick={() => openReturnModal(sale, it)}
                                    >
                                      Vozvrat
                                    </button>
                                  ) : (
                                    <span className="sales-history-line-status">Qaytgan</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td>{paymentLabel(sale.paymentType)}</td>
                      <td>
                        <div>{formatCurrency(sale.totalAmount)}</div>
                        {Number(sale.returnedAmount || 0) > 0 ? (
                          <small>Qaytgan: {formatCurrency(sale.returnedAmount)}</small>
                        ) : null}
                      </td>
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

      {returnModalOpen ? (
        <div className="modal-backdrop" onClick={closeReturnModal}>
          <section className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Vozvrat</h3>
            <p className="modal-subtitle">{returnForm.productName}</p>
            <form className="modal-form" onSubmit={submitReturn}>
              <div className="history-grid">
                <article className="history-item">
                  <strong>Sotilgan</strong>
                  <p>{formatMoney(returnForm.soldQty)} {returnForm.unit}</p>
                </article>
                <article className="history-item">
                  <strong>Qolgan vozvrat</strong>
                  <p>{formatMoney(returnForm.leftQty)} {returnForm.unit}</p>
                </article>
                <article className="history-item">
                  <strong>Birlik narx</strong>
                  <p>{formatCurrency(returnForm.unitPrice)}</p>
                </article>
                <article className="history-item">
                  <strong>Qaytariladigan summa</strong>
                  <p>{formatCurrency(returnTotal)}</p>
                </article>
              </div>

              <label>
                Miqdor
                <input
                  type="number"
                  inputMode={getQuantityInputMode(returnForm.unit)}
                  min={getQuantityMin(returnForm.unit)}
                  step={getQuantityStep(returnForm.unit)}
                  max={String(returnForm.leftQty)}
                  value={returnForm.qty}
                  onChange={(e) => setReturnForm((p) => ({ ...p, qty: e.target.value }))}
                  required
                />
              </label>

              <label>
                Pul qaysi to'lovdan qaytarilsin
                <select
                  value={returnForm.paymentType}
                  onChange={(e) => setReturnForm((p) => ({ ...p, paymentType: e.target.value }))}
                >
                  <option value="cash">Naqd</option>
                  <option value="card">Karta</option>
                  <option value="click">Click</option>
                  <option value="mixed">Aralash</option>
                  <option value="debt">Qarzdan yechish</option>
                </select>
              </label>

              <p className="hint">
                Mavjud: Naqd {formatCurrency(returnForm.salePayments.cash)}, Karta {formatCurrency(returnForm.salePayments.card)}, Click {formatCurrency(returnForm.salePayments.click)}
                , Qarz {formatCurrency(returnForm.saleDebt)}
              </p>

              {returnForm.paymentType === "mixed" ? (
                <div className="cashier-mix-grid">
                  <label>Naqd<input value={returnForm.mixed.cash} onChange={(e) => setReturnForm((p) => ({ ...p, mixed: { ...p.mixed, cash: e.target.value } }))} /></label>
                  <label>Karta<input value={returnForm.mixed.card} onChange={(e) => setReturnForm((p) => ({ ...p, mixed: { ...p.mixed, card: e.target.value } }))} /></label>
                  <label>Click<input value={returnForm.mixed.click} onChange={(e) => setReturnForm((p) => ({ ...p, mixed: { ...p.mixed, click: e.target.value } }))} /></label>
                </div>
              ) : null}

              {returnError ? <p className="error-text">{returnError}</p> : null}
              <div className="modal-actions">
                <button type="button" className="ghost" onClick={closeReturnModal}>Bekor qilish</button>
                <button type="submit" disabled={!canReturn || returningSale}>
                  {returningSale ? "Vozvrat saqlanmoqda..." : "Vozvrat qilish"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {debtCustomerOpen ? (
        <div className="modal-backdrop" onClick={() => setDebtCustomerOpen(false)}>
          <section className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Qarzga sotuv - mijoz</h3>
            <div className="cashier-pay-types" style={{ marginBottom: "10px", gridTemplateColumns: "repeat(2, 1fr)" }}>
              <button
                type="button"
                className={debtCustomerMode === "existing" ? "active" : ""}
                onClick={() => setDebtCustomerMode("existing")}
              >
                Eski mijoz
              </button>
              <button
                type="button"
                className={debtCustomerMode === "new" ? "active" : ""}
                onClick={() => {
                  setDebtCustomerMode("new");
                  setSelectedDebtCustomerId("");
                  setDebtCustomer({ fullName: "", phone: "", address: "" });
                }}
              >
                Yangi mijoz
              </button>
            </div>

            <form
              className="modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!debtCustomer.fullName.trim() || !debtCustomer.phone.trim() || !debtCustomer.address.trim()) return;
                setDebtCustomerOpen(false);
              }}
            >
              {debtCustomerMode === "existing" ? (
                <>
                  <label>
                    Mavjud mijozlar
                    <input
                      value={debtCustomerSearch}
                      onChange={(e) => setDebtCustomerSearch(e.target.value)}
                      placeholder="Ism yoki telefon bo'yicha qidiring"
                    />
                  </label>
                  {debtCustomerSearch.trim() ? (
                    <div style={{ marginBottom: "10px", display: "grid", gap: "8px", maxHeight: "190px", overflow: "auto" }}>
                      {customersSearching ? (
                        <p className="hint">Yuklanmoqda...</p>
                      ) : debtCustomerResults.length < 1 ? (
                        <p className="hint">Mijoz topilmadi</p>
                      ) : debtCustomerResults.map((c) => (
                        <button
                          key={c._id}
                          type="button"
                          className="ghost"
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                            textAlign: "left",
                            border: selectedDebtCustomerId === c._id ? "1px solid rgba(56,189,248,0.65)" : "1px solid rgba(148,163,184,0.35)",
                            background: selectedDebtCustomerId === c._id ? "rgba(14,116,144,0.35)" : "rgba(15,23,42,0.55)"
                          }}
                          onClick={() => {
                            setSelectedDebtCustomerId(c._id);
                            setDebtCustomer({
                              fullName: c.fullName || "",
                              phone: c.phone || "",
                              address: c.address || ""
                            });
                          }}
                        >
                          <span>{c.fullName}</span>
                          <span>{c.phone}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {selectedDebtCustomerId ? (
                    <p className="hint">Tanlandi: {debtCustomer.fullName} | {debtCustomer.phone}</p>
                  ) : (
                    <p className="hint">Mijozni qidirib ustiga bosing</p>
                  )}
                </>
              ) : null}

              {debtCustomerMode === "new" ? (
                <>
                  <label>
                    Ism-familya
                    <input
                      value={debtCustomer.fullName}
                      onChange={(e) => setDebtCustomer((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="Masalan: Ali Valiyev"
                      required
                    />
                  </label>
                  <label>
                    Telefon
                    <input
                      value={debtCustomer.phone}
                      onChange={(e) => setDebtCustomer((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+99890..."
                      required
                    />
                  </label>
                  <label>
                    Manzil
                    <input
                      value={debtCustomer.address}
                      onChange={(e) => setDebtCustomer((p) => ({ ...p, address: e.target.value }))}
                      placeholder="Tuman, ko'cha, uy"
                      required
                    />
                  </label>
                </>
              ) : null}

              <div className="modal-actions">
                <button type="button" className="ghost" onClick={() => setDebtCustomerOpen(false)}>Bekor qilish</button>
                <button type="submit">Saqlash</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
