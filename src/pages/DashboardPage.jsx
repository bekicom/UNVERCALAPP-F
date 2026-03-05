import { useEffect, useMemo, useState } from "react";
import {
  useCreateCategoryMutation,
  useCreateExpenseMutation,
  useCreateProductMutation,
  useCreateSupplierMutation,
  useCreateUserMutation,
  useDeleteExpenseMutation,
  useDeleteProductMutation,
  useDeleteSupplierMutation,
  useGetCustomersQuery,
  useGetCategoriesQuery,
  useGetExpensesQuery,
  useGetOverviewQuery,
  useGetProductsQuery,
  useGetSaleReturnsQuery,
  useGetSalesQuery,
  useGetSettingsQuery,
  useGetSuppliersQuery,
  useGetUsersQuery,
  useLazyGetCustomerLedgerQuery,
  useLazyGetSupplierFinanceQuery,
  usePayCustomerDebtMutation,
  usePaySupplierDebtMutation,
  useRestockProductMutation,
  useUpdateExpenseMutation,
  useUpdateProductMutation,
  useUpdateSettingsMutation,
  useUpdateSupplierMutation,
  useUpdateUserMutation
} from "../app/api/baseApi";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { CategoryModal } from "../components/modals/CategoryModal";
import { ExpenseModal } from "../components/modals/ExpenseModal";
import { ProductModal } from "../components/modals/ProductModal";
import { RestockModal } from "../components/modals/RestockModal";
import { CustomerDebtModal } from "../components/modals/CustomerDebtModal";
import { SupplierHistoryModal } from "../components/modals/SupplierHistoryModal";
import { SupplierModal } from "../components/modals/SupplierModal";
import { SupplierPaymentModal } from "../components/modals/SupplierPaymentModal";
import { UserModal } from "../components/modals/UserModal";
import { CustomersSection } from "../components/sections/CustomersSection";
import { ExpensesSection } from "../components/sections/ExpensesSection";
import { HomeSection } from "../components/sections/HomeSection";
import { PlaceholderSection } from "../components/sections/PlaceholderSection";
import { ProductsSection } from "../components/sections/ProductsSection";
import { ReturnsSection } from "../components/sections/ReturnsSection";
import { SalesSection } from "../components/sections/SalesSection";
import { SettingsSection } from "../components/sections/SettingsSection";
import { SuppliersSection } from "../components/sections/SuppliersSection";
import { UsersSection } from "../components/sections/UsersSection";
import { getCategoryId, getCategoryName, getSupplierName, getSupplierId, toDateInput } from "../utils/format";

export function DashboardPage({ user, onLogout, theme = "dark", setTheme = () => {}, keyboardEnabled = true }) {
  const [activeSection, setActiveSection] = useState("Mahsulotlar");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [salesPeriod, setSalesPeriod] = useState("today");
  const [salesDateFrom, setSalesDateFrom] = useState("");
  const [salesDateTo, setSalesDateTo] = useState("");
  const [homeDateFrom, setHomeDateFrom] = useState("");
  const [homeDateTo, setHomeDateTo] = useState("");
  const [returnsPeriod, setReturnsPeriod] = useState("today");
  const [returnsDateFrom, setReturnsDateFrom] = useState("");
  const [returnsDateTo, setReturnsDateTo] = useState("");

  const salesQueryArgs = useMemo(() => {
    const args = { limit: 300 };
    if (salesPeriod && salesPeriod !== "all") args.period = salesPeriod;
    if (salesDateFrom) args.from = salesDateFrom;
    if (salesDateTo) args.to = salesDateTo;
    return args;
  }, [salesPeriod, salesDateFrom, salesDateTo]);

  const returnsQueryArgs = useMemo(() => {
    const args = { limit: 500 };
    if (returnsPeriod && returnsPeriod !== "all") args.period = returnsPeriod;
    if (returnsDateFrom) args.from = returnsDateFrom;
    if (returnsDateTo) args.to = returnsDateTo;
    return args;
  }, [returnsPeriod, returnsDateFrom, returnsDateTo]);

  const homeSalesQueryArgs = useMemo(() => {
    const args = { limit: 500, period: "all" };
    if (homeDateFrom) args.from = homeDateFrom;
    if (homeDateTo) args.to = homeDateTo;
    return args;
  }, [homeDateFrom, homeDateTo]);

  const homeReturnsQueryArgs = useMemo(() => {
    const args = { limit: 500, period: "all" };
    if (homeDateFrom) args.from = homeDateFrom;
    if (homeDateTo) args.to = homeDateTo;
    return args;
  }, [homeDateFrom, homeDateTo]);

  const { data: overviewRes, error: overviewError, refetch: refetchOverview } = useGetOverviewQuery();
  const { data: categoriesRes, error: categoriesError, refetch: refetchCategories } = useGetCategoriesQuery();
  const { data: suppliersRes, error: suppliersError, refetch: refetchSuppliers } = useGetSuppliersQuery();
  const { data: productsRes, error: productsError, refetch: refetchProducts } = useGetProductsQuery();
  const { data: expensesRes, error: expensesError, refetch: refetchExpenses } = useGetExpensesQuery();
  const { data: usersRes, error: usersError, refetch: refetchUsers } = useGetUsersQuery(undefined, { skip: user?.role !== "admin" });
  const { data: salesRes, error: salesError, isLoading: salesLoading } = useGetSalesQuery(salesQueryArgs, { skip: user?.role !== "admin" });
  const { data: returnsRes, error: returnsError, isLoading: returnsLoading } = useGetSaleReturnsQuery(returnsQueryArgs, { skip: user?.role !== "admin" });
  const { data: settingsRes, error: settingsError, refetch: refetchSettings } = useGetSettingsQuery();
  const { data: customersRes, error: customersError, refetch: refetchCustomers } = useGetCustomersQuery(undefined, { skip: user?.role !== "admin" });
  const { data: homeSalesRes } = useGetSalesQuery(homeSalesQueryArgs, { skip: user?.role !== "admin" });
  const { data: homeReturnsRes } = useGetSaleReturnsQuery(homeReturnsQueryArgs, { skip: user?.role !== "admin" });
  const [fetchCustomerLedger] = useLazyGetCustomerLedgerQuery();
  const [fetchSupplierFinance] = useLazyGetSupplierFinanceQuery();

  const [createCategory, { isLoading: creatingCategory }] = useCreateCategoryMutation();
  const [createSupplier, { isLoading: creatingSupplier }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: updatingSupplier }] = useUpdateSupplierMutation();
  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();
  const [updateUser, { isLoading: updatingUser }] = useUpdateUserMutation();
  const [deleteSupplierMutation] = useDeleteSupplierMutation();
  const [createProduct, { isLoading: creatingProduct }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updatingProduct }] = useUpdateProductMutation();
  const [deleteProductMutation] = useDeleteProductMutation();
  const [restockProduct, { isLoading: restocking }] = useRestockProductMutation();
  const [paySupplierDebt, { isLoading: payingSupplier }] = usePaySupplierDebtMutation();
  const [payCustomerDebt, { isLoading: payingCustomer }] = usePayCustomerDebtMutation();
  const [createExpense, { isLoading: creatingExpense }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: updatingExpense }] = useUpdateExpenseMutation();
  const [updateSettings, { isLoading: savingSettings }] = useUpdateSettingsMutation();
  const [deleteExpenseMutation] = useDeleteExpenseMutation();

  const categories = categoriesRes?.categories || [];
  const suppliers = suppliersRes?.suppliers || [];
  const users = usersRes?.users || [];
  const products = productsRes?.products || [];
  const expenses = expensesRes?.expenses || [];
  const sales = salesRes?.sales || [];
  const returns = returnsRes?.returns || [];
  const customers = customersRes?.customers || [];
  const customersSummary = customersRes?.summary || { totalCustomers: 0, activeDebtors: 0, totalDebt: 0, totalPaid: 0 };
  const homeSales = homeSalesRes?.sales || [];
  const homeReturns = homeReturnsRes?.returns || [];
  const salesSummary = salesRes?.summary || {
    totalSales: 0,
    totalRevenue: 0,
    totalCash: 0,
    totalCard: 0,
    totalClick: 0,
    totalProfit: 0
  };
  const homeSalesSummary = homeSalesRes?.summary || {
    totalSales: 0,
    totalRevenue: 0,
    totalCash: 0,
    totalCard: 0,
    totalClick: 0,
    totalProfit: 0
  };
  const returnsSummary = returnsRes?.summary || {
    totalReturns: 0,
    totalReturnedAmount: 0,
    totalReturnedCash: 0,
    totalReturnedCard: 0,
    totalReturnedClick: 0,
    totalReturnedQty: 0
  };
  const homeReturnsSummary = homeReturnsRes?.summary || {
    totalReturns: 0,
    totalReturnedAmount: 0,
    totalReturnedCash: 0,
    totalReturnedCard: 0,
    totalReturnedClick: 0,
    totalReturnedQty: 0
  };
  const overview = overviewRes || null;
  const settings = settingsRes?.settings || {
    lowStockThreshold: 5,
    usdRate: 12171,
    keyboardEnabled: true,
    receipt: { title: "CHEK", footer: "Xaridingiz uchun rahmat!", logoUrl: "" }
  };

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalError, setCategoryModalError] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierModalError, setSupplierModalError] = useState("");
  const [supplierForm, setSupplierForm] = useState({ id: "", name: "", address: "", phone: "" });
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalError, setUserModalError] = useState("");
  const [userForm, setUserForm] = useState({ id: "", username: "", role: "cashier", password: "" });

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseModalError, setExpenseModalError] = useState("");
  const [expenseForm, setExpenseForm] = useState({ id: "", amount: "", reason: "", spentAt: toDateInput() });

  const [supplierHistoryOpen, setSupplierHistoryOpen] = useState(false);
  const [supplierHistoryLoading, setSupplierHistoryLoading] = useState(false);
  const [supplierHistoryError, setSupplierHistoryError] = useState("");
  const [supplierHistorySupplier, setSupplierHistorySupplier] = useState(null);
  const [supplierHistoryDaily, setSupplierHistoryDaily] = useState([]);
  const [supplierHistoryPurchases, setSupplierHistoryPurchases] = useState([]);

  const [supplierPaymentOpen, setSupplierPaymentOpen] = useState(false);
  const [supplierPaymentModalLoading, setSupplierPaymentModalLoading] = useState(false);
  const [supplierPaymentModalError, setSupplierPaymentModalError] = useState("");
  const [supplierPaymentSupplier, setSupplierPaymentSupplier] = useState(null);
  const [supplierHistoryPayments, setSupplierHistoryPayments] = useState([]);
  const [supplierHistoryTotals, setSupplierHistoryTotals] = useState({ totalPurchase: 0, totalPaid: 0, totalDebt: 0 });
  const [supplierDebtPurchases, setSupplierDebtPurchases] = useState([]);
  const [supplierPaymentForm, setSupplierPaymentForm] = useState({ amount: "", note: "" });
  const [supplierPaymentError, setSupplierPaymentError] = useState("");
  const [customerDebtOpen, setCustomerDebtOpen] = useState(false);
  const [customerDebtLoading, setCustomerDebtLoading] = useState(false);
  const [customerDebtError, setCustomerDebtError] = useState("");
  const [customerDebtPaymentError, setCustomerDebtPaymentError] = useState("");
  const [customerDebtCustomer, setCustomerDebtCustomer] = useState(null);
  const [customerDebtSales, setCustomerDebtSales] = useState([]);
  const [customerDebtPayments, setCustomerDebtPayments] = useState([]);
  const [customerDebtTotals, setCustomerDebtTotals] = useState({ totalSalesAmount: 0, totalDebt: 0, totalPaid: 0 });
  const [customerDebtForm, setCustomerDebtForm] = useState({ amount: "", note: "" });

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productModalError, setProductModalError] = useState("");
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    model: "",
    categoryId: "",
    supplierId: "",
    purchasePrice: "",
    priceCurrency: "uzs",
    retailPrice: "",
    wholesalePrice: "",
    paymentType: "naqd",
    paidAmount: "",
    quantity: "",
    unit: "dona",
    allowPieceSale: false,
    pieceUnit: "kg",
    pieceQtyPerBase: "",
    piecePrice: ""
  });

  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [restockModalError, setRestockModalError] = useState("");
  const [restockTarget, setRestockTarget] = useState(null);
  const [restockForm, setRestockForm] = useState({
    supplierId: "",
    quantity: "",
    purchasePrice: "",
    priceCurrency: "uzs",
    pricingMode: "keep_old",
    retailPrice: "",
    wholesalePrice: "",
    piecePrice: "",
    paymentType: "naqd",
    paidAmount: ""
  });
  const [settingsErrorMsg, setSettingsErrorMsg] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    lowStockThreshold: "5",
    usdRate: "12171",
    keyboardEnabled: true,
    receipt: { title: "", footer: "", logoUrl: "" }
  });

  useEffect(() => {
    if (!settingsRes?.settings) return;
    setSettingsForm({
      lowStockThreshold: String(settingsRes.settings.lowStockThreshold ?? 5),
      usdRate: String(settingsRes.settings.usdRate ?? 12171),
      keyboardEnabled: Boolean(settingsRes.settings.keyboardEnabled),
      receipt: {
        title: settingsRes.settings.receipt?.title || "",
        footer: settingsRes.settings.receipt?.footer || "",
        logoUrl: settingsRes.settings.receipt?.logoUrl || ""
      }
    });
  }, [settingsRes]);

  useEffect(() => {
    const any401 = [overviewError, categoriesError, suppliersError, productsError, expensesError, usersError, salesError, returnsError, customersError, settingsError]
      .some((e) => Number(e?.status) === 401);
    if (any401) onLogout();
  }, [overviewError, categoriesError, suppliersError, productsError, expensesError, usersError, salesError, returnsError, customersError, settingsError, onLogout]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = !q || [p.name, p.model, p.unit, getCategoryName(p), getSupplierName(p)].join(" ").toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || getCategoryId(p) === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const filteredSuppliers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => [s.name, s.address, s.phone].join(" ").toLowerCase().includes(q));
  }, [suppliers, search]);

  const filteredExpenses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return expenses;
    return expenses.filter((e) =>
      [e.reason, String(e.amount), new Date(e.spentAt).toLocaleDateString()].join(" ").toLowerCase().includes(q)
    );
  }, [expenses, search]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => [u.username, u.role].join(" ").toLowerCase().includes(q));
  }, [users, search]);

  const openCategoryModal = () => {
    setCategoryModalError("");
    setCategoryName("");
    setCategoryModalOpen(true);
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    setCategoryModalError("");
    try {
      await createCategory({ name: categoryName }).unwrap();
      setCategoryModalOpen(false);
      refetchCategories();
    } catch (err) {
      setCategoryModalError(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  const openCreateSupplierModal = () => {
    setSupplierForm({ id: "", name: "", address: "", phone: "" });
    setSupplierModalError("");
    setSupplierModalOpen(true);
  };

  const openCreateUserModal = () => {
    setUserForm({ id: "", username: "", role: "cashier", password: "" });
    setUserModalError("");
    setUserModalOpen(true);
  };

  const openEditUserModal = (u) => {
    setUserForm({ id: u._id, username: u.username, role: u.role, password: "" });
    setUserModalError("");
    setUserModalOpen(true);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    setUserModalError("");
    try {
      if (userForm.id) {
        await updateUser({
          id: userForm.id,
          username: userForm.username,
          role: userForm.role,
          password: userForm.password
        }).unwrap();
      } else {
        await createUser({
          username: userForm.username,
          role: userForm.role,
          password: userForm.password
        }).unwrap();
      }
      setUserModalOpen(false);
      await Promise.all([refetchUsers(), refetchOverview()]);
    } catch (err) {
      setUserModalError(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  const openEditSupplierModal = (s) => {
    setSupplierForm({ id: s._id, name: s.name, address: s.address || "", phone: s.phone || "" });
    setSupplierModalError("");
    setSupplierModalOpen(true);
  };

  const saveSupplier = async (e) => {
    e.preventDefault();
    setSupplierModalError("");
    try {
      const payload = { name: supplierForm.name, address: supplierForm.address, phone: supplierForm.phone };
      if (supplierForm.id) {
        await updateSupplier({ id: supplierForm.id, ...payload }).unwrap();
      } else {
        await createSupplier(payload).unwrap();
      }
      setSupplierModalOpen(false);
      refetchSuppliers();
    } catch (err) {
      setSupplierModalError(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm("Yetkazib beruvchini o'chirmoqchimisiz?")) return;
    await deleteSupplierMutation(id).unwrap();
    refetchSuppliers();
  };

  const openCreateExpenseModal = () => {
    setExpenseForm({ id: "", amount: "", reason: "", spentAt: toDateInput() });
    setExpenseModalError("");
    setExpenseModalOpen(true);
  };

  const openEditExpenseModal = (expense) => {
    setExpenseForm({
      id: expense._id,
      amount: String(expense.amount ?? ""),
      reason: expense.reason || "",
      spentAt: toDateInput(expense.spentAt)
    });
    setExpenseModalError("");
    setExpenseModalOpen(true);
  };

  const saveExpense = async (e) => {
    e.preventDefault();
    setExpenseModalError("");
    try {
      const payload = { amount: Number(expenseForm.amount), reason: expenseForm.reason, spentAt: expenseForm.spentAt };
      if (expenseForm.id) {
        await updateExpense({ id: expenseForm.id, ...payload }).unwrap();
      } else {
        await createExpense(payload).unwrap();
      }
      setExpenseModalOpen(false);
      refetchExpenses();
    } catch (err) {
      setExpenseModalError(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Xarajatni o'chirmoqchimisiz?")) return;
    await deleteExpenseMutation(id).unwrap();
    refetchExpenses();
  };

  const loadSupplierFinance = async (supplierId) => {
    const data = await fetchSupplierFinance(supplierId).unwrap();
    setSupplierHistoryPayments(data.payments || []);
    setSupplierHistoryTotals(data.totals || { totalPurchase: 0, totalPaid: 0, totalDebt: 0 });
    setSupplierDebtPurchases((data.purchases || []).filter((p) => Number(p.debtAmount) > 0));
    return data;
  };

  const openSupplierHistory = async (supplier) => {
    setSupplierHistorySupplier(supplier);
    setSupplierHistoryError("");
    setSupplierHistoryLoading(true);
    setSupplierHistoryOpen(true);
    try {
      const data = await loadSupplierFinance(supplier._id);
      setSupplierHistoryDaily(data.daily || []);
      setSupplierHistoryPurchases(data.purchases || []);
    } catch (err) {
      setSupplierHistoryError(err?.data?.message || err?.message || "Xatolik yuz berdi");
      setSupplierHistoryDaily([]);
      setSupplierHistoryPurchases([]);
    } finally {
      setSupplierHistoryLoading(false);
    }
  };

  const openSupplierPaymentModal = async (supplier) => {
    setSupplierPaymentSupplier(supplier);
    setSupplierPaymentModalError("");
    setSupplierPaymentError("");
    setSupplierPaymentForm({ amount: "", note: "" });
    setSupplierPaymentModalLoading(true);
    setSupplierPaymentOpen(true);
    try {
      await loadSupplierFinance(supplier._id);
    } catch (err) {
      setSupplierPaymentModalError(err?.data?.message || err?.message || "Xatolik yuz berdi");
      setSupplierHistoryPayments([]);
      setSupplierHistoryTotals({ totalPurchase: 0, totalPaid: 0, totalDebt: 0 });
      setSupplierDebtPurchases([]);
    } finally {
      setSupplierPaymentModalLoading(false);
    }
  };

  const closeSupplierPaymentModal = () => {
    setSupplierPaymentOpen(false);
    setSupplierPaymentModalError("");
    setSupplierPaymentError("");
    setSupplierPaymentForm({ amount: "", note: "" });
  };

  const submitSupplierPayment = async (e) => {
    e.preventDefault();
    if (!supplierPaymentSupplier) return;
    setSupplierPaymentError("");
    try {
      await paySupplierDebt({
        id: supplierPaymentSupplier._id,
        amount: Number(supplierPaymentForm.amount),
        note: supplierPaymentForm.note
      }).unwrap();
      await Promise.all([loadSupplierFinance(supplierPaymentSupplier._id), refetchSuppliers(), refetchOverview()]);
      setSupplierPaymentForm({ amount: "", note: "" });
    } catch (err) {
      setSupplierPaymentError(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  const openCustomerDebtModal = async (customer) => {
    setCustomerDebtCustomer(customer);
    setCustomerDebtOpen(true);
    setCustomerDebtError("");
    setCustomerDebtPaymentError("");
    setCustomerDebtLoading(true);
    setCustomerDebtForm({ amount: "", note: "" });
    try {
      const data = await fetchCustomerLedger(customer._id).unwrap();
      setCustomerDebtSales(data.sales || []);
      setCustomerDebtPayments(data.payments || []);
      setCustomerDebtTotals(data.totals || { totalSalesAmount: 0, totalDebt: 0, totalPaid: 0 });
    } catch (err) {
      setCustomerDebtError(err?.data?.message || err?.message || "Xatolik yuz berdi");
      setCustomerDebtSales([]);
      setCustomerDebtPayments([]);
      setCustomerDebtTotals({ totalSalesAmount: 0, totalDebt: 0, totalPaid: 0 });
    } finally {
      setCustomerDebtLoading(false);
    }
  };

  const closeCustomerDebtModal = () => {
    setCustomerDebtOpen(false);
    setCustomerDebtError("");
    setCustomerDebtPaymentError("");
    setCustomerDebtForm({ amount: "", note: "" });
  };

  const submitCustomerDebtPayment = async (e) => {
    e.preventDefault();
    if (!customerDebtCustomer) return;
    setCustomerDebtPaymentError("");
    try {
      await payCustomerDebt({
        id: customerDebtCustomer._id,
        amount: Number(customerDebtForm.amount),
        note: customerDebtForm.note
      }).unwrap();
      const data = await fetchCustomerLedger(customerDebtCustomer._id).unwrap();
      setCustomerDebtSales(data.sales || []);
      setCustomerDebtPayments(data.payments || []);
      setCustomerDebtTotals(data.totals || { totalSalesAmount: 0, totalDebt: 0, totalPaid: 0 });
      setCustomerDebtForm({ amount: "", note: "" });
      await Promise.all([refetchCustomers(), refetchOverview()]);
    } catch (err) {
      setCustomerDebtPaymentError(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSettingsErrorMsg("");
    try {
      await updateSettings({
        lowStockThreshold: Number(settingsForm.lowStockThreshold || 0),
        usdRate: Number(settingsForm.usdRate || 0),
        keyboardEnabled: Boolean(settingsForm.keyboardEnabled),
        receipt: {
          title: settingsForm.receipt.title,
          footer: settingsForm.receipt.footer,
          logoUrl: settingsForm.receipt.logoUrl
        }
      }).unwrap();
      await Promise.all([refetchSettings(), refetchProducts()]);
    } catch (err) {
      setSettingsErrorMsg(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  const toCurrencyInput = (amount, currency) => {
    const numeric = Number(amount || 0);
    if (!Number.isFinite(numeric)) return "";
    if (currency === "usd") {
      const rate = Number(settings.usdRate || 12171);
      const usd = rate > 0 ? numeric / rate : 0;
      return String(Math.round(usd * 100) / 100);
    }
    return String(Math.round(numeric * 100) / 100);
  };

  const openCreateProductModal = () => {
    setProductForm({
      id: "",
      name: "",
      model: "",
      categoryId: categories[0]?._id || "",
      supplierId: suppliers[0]?._id || "",
      purchasePrice: "",
      priceCurrency: "uzs",
      retailPrice: "",
      wholesalePrice: "",
      paymentType: "naqd",
      paidAmount: "",
      quantity: "",
      unit: "dona",
      allowPieceSale: false,
      pieceUnit: "kg",
      pieceQtyPerBase: "",
      piecePrice: ""
    });
    setProductModalError("");
    setProductModalOpen(true);
  };

  const openEditProductModal = (p) => {
    const priceCurrency = p.priceCurrency || "uzs";
    setProductForm({
      id: p._id,
      name: p.name,
      model: p.model,
      categoryId: getCategoryId(p),
      supplierId: getSupplierId(p),
      purchasePrice: toCurrencyInput(p.purchasePrice, priceCurrency),
      priceCurrency,
      retailPrice: toCurrencyInput(p.retailPrice, priceCurrency),
      wholesalePrice: toCurrencyInput(p.wholesalePrice, priceCurrency),
      paymentType: p.paymentType || "naqd",
      paidAmount: toCurrencyInput(p.paidAmount, priceCurrency),
      quantity: String(p.quantity ?? ""),
      unit: p.unit || "dona",
      allowPieceSale: Boolean(p.allowPieceSale),
      pieceUnit: String(p.pieceUnit || "kg").toLowerCase(),
      pieceQtyPerBase: String(p.pieceQtyPerBase ?? ""),
      piecePrice: toCurrencyInput(p.piecePrice, priceCurrency)
    });
    setProductModalError("");
    setProductModalOpen(true);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setProductModalError("");
    try {
      const payload = {
        name: productForm.name,
        model: productForm.model,
        categoryId: productForm.categoryId,
        supplierId: productForm.supplierId,
        purchasePrice: Number(productForm.purchasePrice),
        priceCurrency: productForm.priceCurrency,
        retailPrice: Number(productForm.retailPrice),
        wholesalePrice: Number(productForm.wholesalePrice),
        paymentType: productForm.paymentType,
        paidAmount: productForm.paymentType === "naqd"
          ? Number(productForm.purchasePrice) * Number(productForm.quantity)
          : productForm.paymentType === "qarz"
            ? 0
            : Number(productForm.paidAmount || 0),
        quantity: Number(productForm.quantity),
        unit: productForm.unit,
        allowPieceSale: Boolean(productForm.unit === "qop" && productForm.allowPieceSale),
        pieceUnit: productForm.unit === "qop" ? productForm.pieceUnit : "kg",
        pieceQtyPerBase: productForm.unit === "qop" && productForm.allowPieceSale ? Number(productForm.pieceQtyPerBase) : 0,
        piecePrice: productForm.unit === "qop" && productForm.allowPieceSale ? Number(productForm.piecePrice) : 0
      };

      if (productForm.id) await updateProduct({ id: productForm.id, ...payload }).unwrap();
      else await createProduct(payload).unwrap();

      setProductModalOpen(false);
      await Promise.all([refetchProducts(), refetchOverview(), refetchSuppliers()]);
    } catch (err) {
      setProductModalError(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Mahsulotni o'chirmoqchimisiz?")) return;
    await deleteProductMutation(id).unwrap();
    await Promise.all([refetchProducts(), refetchOverview(), refetchSuppliers()]);
  };

  const openRestockModal = (product) => {
    const priceCurrency = product.priceCurrency || "uzs";
    setRestockTarget(product);
    setRestockModalError("");
    setRestockForm({
      supplierId: getSupplierId(product),
      quantity: "",
      purchasePrice: toCurrencyInput(product.purchasePrice, priceCurrency),
      priceCurrency,
      pricingMode: "keep_old",
      retailPrice: toCurrencyInput(product.retailPrice, priceCurrency),
      wholesalePrice: toCurrencyInput(product.wholesalePrice, priceCurrency),
      piecePrice: toCurrencyInput(product.piecePrice, priceCurrency),
      paymentType: "naqd",
      paidAmount: ""
    });
    setRestockModalOpen(true);
  };

  const saveRestock = async (e) => {
    e.preventDefault();
    if (!restockTarget) return;
    setRestockModalError("");
    try {
      await restockProduct({
        id: restockTarget._id,
        supplierId: restockForm.supplierId,
        quantity: Number(restockForm.quantity),
        purchasePrice: Number(restockForm.purchasePrice),
        priceCurrency: restockForm.priceCurrency,
        pricingMode: restockForm.pricingMode,
        retailPrice: Number(restockForm.retailPrice),
        wholesalePrice: Number(restockForm.wholesalePrice),
        piecePrice: Number(restockForm.piecePrice),
        paymentType: restockForm.paymentType,
        paidAmount: restockForm.paymentType === "qisman" ? Number(restockForm.paidAmount || 0) : 0
      }).unwrap();

      setRestockModalOpen(false);
      await Promise.all([refetchProducts(), refetchSuppliers(), refetchOverview()]);
    } catch (err) {
      setRestockModalError(err?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  };

  return (
    <main className="dashboard-page">
      <Sidebar user={user} activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} />

      <section className="workspace">
        <Topbar
          activeSection={activeSection}
          openCategoryModal={openCategoryModal}
          openCreateSupplierModal={openCreateSupplierModal}
          openCreateProductModal={openCreateProductModal}
          openCreateExpenseModal={openCreateExpenseModal}
          openCreateUserModal={openCreateUserModal}
          theme={theme}
          onToggleTheme={() => setTheme((p) => (p === "dark" ? "light" : "dark"))}
        />

        {activeSection !== "Sotuv tarixi" && activeSection !== "Qaytarib olish" && activeSection !== "Bosh sahifa" && activeSection !== "Clientlar" && activeSection !== "Sozlamalar" ? (
          <section className="panel panel-row">
            <input className="search-input" placeholder="Qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {activeSection === "Mahsulotlar" ? (
              <select className="search-input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">Barcha kategoriyalar</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            ) : (
              <div />
            )}
          </section>
        ) : null}

        {activeSection === "Bosh sahifa" ? (
          <HomeSection
            overview={overview}
            products={products}
            suppliers={suppliers}
            expenses={expenses}
            sales={homeSales}
            salesSummary={homeSalesSummary}
            returns={homeReturns}
            returnsSummary={homeReturnsSummary}
            dateFrom={homeDateFrom}
            dateTo={homeDateTo}
            setDateFrom={setHomeDateFrom}
            setDateTo={setHomeDateTo}
            search={search}
            setSearch={setSearch}
          />
        ) : activeSection === "Mahsulotlar" ? (
          <ProductsSection
            products={filteredProducts}
            lowStockThreshold={Number(settings.lowStockThreshold || 0)}
            onRestock={openRestockModal}
            onEdit={openEditProductModal}
            onDelete={deleteProduct}
          />
        ) : activeSection === "Yetkazib beruvchilar" ? (
          <SuppliersSection suppliers={filteredSuppliers} onOpenPayment={openSupplierPaymentModal} onOpenHistory={openSupplierHistory} onEdit={openEditSupplierModal} onDelete={deleteSupplier} />
        ) : activeSection === "Clientlar" ? (
          <CustomersSection customers={customers} summary={customersSummary} search={search} setSearch={setSearch} onOpenLedger={openCustomerDebtModal} />
        ) : activeSection === "Sozlamalar" ? (
          <SettingsSection
            form={settingsForm}
            setForm={setSettingsForm}
            saving={savingSettings}
            error={settingsErrorMsg}
            onSave={saveSettings}
            onReset={() =>
              setSettingsForm({
                lowStockThreshold: String(settings.lowStockThreshold ?? 5),
                usdRate: String(settings.usdRate ?? 12171),
                keyboardEnabled: Boolean(settings.keyboardEnabled),
                receipt: {
                  title: settings.receipt?.title || "",
                  footer: settings.receipt?.footer || "",
                  logoUrl: settings.receipt?.logoUrl || ""
                }
              })
            }
          />
        ) : activeSection === "Xarajatlar" ? (
          <ExpensesSection expenses={filteredExpenses} onEdit={openEditExpenseModal} onDelete={deleteExpense} />
        ) : activeSection === "Sotuv tarixi" ? (
          <SalesSection
            sales={sales}
            summary={salesSummary}
            loading={salesLoading}
            error={salesError}
            search={search}
            setSearch={setSearch}
            period={salesPeriod}
            setPeriod={setSalesPeriod}
            dateFrom={salesDateFrom}
            dateTo={salesDateTo}
            setDateFrom={setSalesDateFrom}
            setDateTo={setSalesDateTo}
          />
        ) : activeSection === "Qaytarib olish" ? (
          <ReturnsSection
            returns={returns}
            summary={returnsSummary}
            loading={returnsLoading}
            error={returnsError}
            search={search}
            setSearch={setSearch}
            period={returnsPeriod}
            setPeriod={setReturnsPeriod}
            dateFrom={returnsDateFrom}
            dateTo={returnsDateTo}
            setDateFrom={setReturnsDateFrom}
            setDateTo={setReturnsDateTo}
          />
        ) : activeSection === "Xodimlar" ? (
          <UsersSection users={filteredUsers} onEdit={openEditUserModal} />
        ) : (
          <PlaceholderSection />
        )}

     
      </section>

      <CategoryModal
        open={categoryModalOpen}
        loading={creatingCategory}
        name={categoryName}
        setName={setCategoryName}
        onSubmit={saveCategory}
        onClose={() => setCategoryModalOpen(false)}
        error={categoryModalError}
        categories={categories}
      />

      <ExpenseModal
        open={expenseModalOpen}
        loading={creatingExpense || updatingExpense}
        form={expenseForm}
        setForm={setExpenseForm}
        onSubmit={saveExpense}
        onClose={() => setExpenseModalOpen(false)}
        error={expenseModalError}
      />

      <ProductModal
        open={productModalOpen}
        loading={creatingProduct || updatingProduct}
        form={productForm}
        setForm={setProductForm}
        onSubmit={saveProduct}
        onClose={() => setProductModalOpen(false)}
        error={productModalError}
        categories={categories}
        suppliers={suppliers}
        usdRate={Number(settings.usdRate || 12171)}
        openCreateSupplierModal={openCreateSupplierModal}
      />

      <SupplierModal
        open={supplierModalOpen}
        loading={creatingSupplier || updatingSupplier}
        form={supplierForm}
        setForm={setSupplierForm}
        onSubmit={saveSupplier}
        onClose={() => setSupplierModalOpen(false)}
        error={supplierModalError}
      />

      <UserModal
        open={userModalOpen}
        loading={creatingUser || updatingUser}
        form={userForm}
        setForm={setUserForm}
        onSubmit={saveUser}
        onClose={() => setUserModalOpen(false)}
        error={userModalError}
      />

      <SupplierHistoryModal
        open={supplierHistoryOpen}
        supplier={supplierHistorySupplier}
        daily={supplierHistoryDaily}
        purchases={supplierHistoryPurchases}
        loading={supplierHistoryLoading}
        error={supplierHistoryError}
        onClose={() => setSupplierHistoryOpen(false)}
      />

      <SupplierPaymentModal
        open={supplierPaymentOpen}
        supplier={supplierPaymentSupplier}
        totals={supplierHistoryTotals}
        payments={supplierHistoryPayments}
        debtPurchases={supplierDebtPurchases}
        form={supplierPaymentForm}
        setForm={setSupplierPaymentForm}
        onPay={submitSupplierPayment}
        loading={supplierPaymentModalLoading}
        paymentLoading={payingSupplier}
        error={supplierPaymentModalError}
        paymentError={supplierPaymentError}
        onClose={closeSupplierPaymentModal}
      />

      <RestockModal
        open={restockModalOpen}
        loading={restocking}
        form={restockForm}
        setForm={setRestockForm}
        onSubmit={saveRestock}
        onClose={() => setRestockModalOpen(false)}
        error={restockModalError}
        suppliers={suppliers}
        product={restockTarget}
        usdRate={Number(settings.usdRate || 12171)}
      />
      <CustomerDebtModal
        open={customerDebtOpen}
        customer={customerDebtCustomer}
        sales={customerDebtSales}
        payments={customerDebtPayments}
        totals={customerDebtTotals}
        form={customerDebtForm}
        setForm={setCustomerDebtForm}
        loading={customerDebtLoading}
        payLoading={payingCustomer}
        error={customerDebtError}
        paymentError={customerDebtPaymentError}
        onPay={submitCustomerDebtPayment}
        onClose={closeCustomerDebtModal}
      />
    </main>
  );
}
