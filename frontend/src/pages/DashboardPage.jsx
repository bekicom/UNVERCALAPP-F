import { useEffect, useMemo, useState } from "react";
import {
  useCreateCategoryMutation,
  useCreateExpenseMutation,
  useCreateProductMutation,
  useCreateSupplierMutation,
  useDeleteExpenseMutation,
  useDeleteProductMutation,
  useDeleteSupplierMutation,
  useGetCategoriesQuery,
  useGetExpensesQuery,
  useGetOverviewQuery,
  useGetProductsQuery,
  useGetSuppliersQuery,
  useLazyGetSupplierFinanceQuery,
  usePaySupplierDebtMutation,
  useRestockProductMutation,
  useUpdateExpenseMutation,
  useUpdateProductMutation,
  useUpdateSupplierMutation
} from "../app/api/baseApi";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { CategoryModal } from "../components/modals/CategoryModal";
import { ExpenseModal } from "../components/modals/ExpenseModal";
import { ProductModal } from "../components/modals/ProductModal";
import { RestockModal } from "../components/modals/RestockModal";
import { SupplierHistoryModal } from "../components/modals/SupplierHistoryModal";
import { SupplierModal } from "../components/modals/SupplierModal";
import { SupplierPaymentModal } from "../components/modals/SupplierPaymentModal";
import { ExpensesSection } from "../components/sections/ExpensesSection";
import { PlaceholderSection } from "../components/sections/PlaceholderSection";
import { ProductsSection } from "../components/sections/ProductsSection";
import { SuppliersSection } from "../components/sections/SuppliersSection";
import { getCategoryId, getCategoryName, getSupplierName, getSupplierId, toDateInput } from "../utils/format";

export function DashboardPage({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState("Mahsulotlar");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: overviewRes, error: overviewError, refetch: refetchOverview } = useGetOverviewQuery();
  const { data: categoriesRes, error: categoriesError, refetch: refetchCategories } = useGetCategoriesQuery();
  const { data: suppliersRes, error: suppliersError, refetch: refetchSuppliers } = useGetSuppliersQuery();
  const { data: productsRes, error: productsError, refetch: refetchProducts } = useGetProductsQuery();
  const { data: expensesRes, error: expensesError, refetch: refetchExpenses } = useGetExpensesQuery();
  const [fetchSupplierFinance] = useLazyGetSupplierFinanceQuery();

  const [createCategory, { isLoading: creatingCategory }] = useCreateCategoryMutation();
  const [createSupplier, { isLoading: creatingSupplier }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: updatingSupplier }] = useUpdateSupplierMutation();
  const [deleteSupplierMutation] = useDeleteSupplierMutation();
  const [createProduct, { isLoading: creatingProduct }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updatingProduct }] = useUpdateProductMutation();
  const [deleteProductMutation] = useDeleteProductMutation();
  const [restockProduct, { isLoading: restocking }] = useRestockProductMutation();
  const [paySupplierDebt, { isLoading: payingSupplier }] = usePaySupplierDebtMutation();
  const [createExpense, { isLoading: creatingExpense }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: updatingExpense }] = useUpdateExpenseMutation();
  const [deleteExpenseMutation] = useDeleteExpenseMutation();

  const categories = categoriesRes?.categories || [];
  const suppliers = suppliersRes?.suppliers || [];
  const products = productsRes?.products || [];
  const expenses = expensesRes?.expenses || [];
  const overview = overviewRes || null;

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalError, setCategoryModalError] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierModalError, setSupplierModalError] = useState("");
  const [supplierForm, setSupplierForm] = useState({ id: "", name: "", address: "", phone: "" });

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

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productModalError, setProductModalError] = useState("");
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    model: "",
    categoryId: "",
    supplierId: "",
    purchasePrice: "",
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
    pricingMode: "keep_old",
    retailPrice: "",
    wholesalePrice: "",
    piecePrice: "",
    paymentType: "naqd",
    paidAmount: ""
  });

  useEffect(() => {
    const any401 = [overviewError, categoriesError, suppliersError, productsError, expensesError]
      .some((e) => Number(e?.status) === 401);
    if (any401) onLogout();
  }, [overviewError, categoriesError, suppliersError, productsError, expensesError, onLogout]);

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

  const openCreateProductModal = () => {
    setProductForm({
      id: "",
      name: "",
      model: "",
      categoryId: categories[0]?._id || "",
      supplierId: suppliers[0]?._id || "",
      purchasePrice: "",
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
    setProductForm({
      id: p._id,
      name: p.name,
      model: p.model,
      categoryId: getCategoryId(p),
      supplierId: getSupplierId(p),
      purchasePrice: String(p.purchasePrice ?? ""),
      retailPrice: String(p.retailPrice ?? ""),
      wholesalePrice: String(p.wholesalePrice ?? ""),
      paymentType: p.paymentType || "naqd",
      paidAmount: String(p.paidAmount ?? ""),
      quantity: String(p.quantity ?? ""),
      unit: p.unit || "dona",
      allowPieceSale: Boolean(p.allowPieceSale),
      pieceUnit: String(p.pieceUnit || "kg").toLowerCase(),
      pieceQtyPerBase: String(p.pieceQtyPerBase ?? ""),
      piecePrice: String(p.piecePrice ?? "")
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
    setRestockTarget(product);
    setRestockModalError("");
    setRestockForm({
      supplierId: getSupplierId(product),
      quantity: "",
      purchasePrice: String(product.purchasePrice || ""),
      pricingMode: "keep_old",
      retailPrice: String(product.retailPrice || ""),
      wholesalePrice: String(product.wholesalePrice || ""),
      piecePrice: String(product.piecePrice || ""),
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
        />

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

        {activeSection === "Mahsulotlar" ? (
          <ProductsSection products={filteredProducts} onRestock={openRestockModal} onEdit={openEditProductModal} onDelete={deleteProduct} />
        ) : activeSection === "Yetkazib beruvchilar" ? (
          <SuppliersSection suppliers={filteredSuppliers} onOpenPayment={openSupplierPaymentModal} onOpenHistory={openSupplierHistory} onEdit={openEditSupplierModal} onDelete={deleteSupplier} />
        ) : activeSection === "Xarajatlar" ? (
          <ExpensesSection expenses={filteredExpenses} onEdit={openEditExpenseModal} onDelete={deleteExpense} />
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
      />
    </main>
  );
}
