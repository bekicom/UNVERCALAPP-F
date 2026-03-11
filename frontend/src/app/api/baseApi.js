import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://unvercalapp.richman.uz/api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ["Overview", "User", "Category", "Supplier", "Product", "Expense", "SupplierFinance", "Sale", "Customer", "CustomerLedger", "Settings"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body })
    }),
    getOverview: builder.query({
      query: () => "/admin/overview",
      providesTags: ["Overview"]
    }),
    getUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["User"]
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: "/admin/users", method: "POST", body }),
      invalidatesTags: ["User", "Overview"]
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/users/${id}`, method: "PUT", body }),
      invalidatesTags: ["User", "Overview"]
    }),
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"]
    }),
    updateSettings: builder.mutation({
      query: (body) => ({ url: "/settings", method: "PUT", body }),
      invalidatesTags: ["Settings", "Product"]
    }),
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Category"]
    }),
    createCategory: builder.mutation({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: ["Category"]
    }),
    getSuppliers: builder.query({
      query: () => "/suppliers",
      providesTags: ["Supplier"]
    }),
    createSupplier: builder.mutation({
      query: (body) => ({ url: "/suppliers", method: "POST", body }),
      invalidatesTags: ["Supplier"]
    }),
    updateSupplier: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/suppliers/${id}`, method: "PUT", body }),
      invalidatesTags: ["Supplier"]
    }),
    deleteSupplier: builder.mutation({
      query: (id) => ({ url: `/suppliers/${id}`, method: "DELETE" }),
      invalidatesTags: ["Supplier"]
    }),
    getSupplierFinance: builder.query({
      query: (id) => `/suppliers/${id}/purchases`,
      providesTags: (_, __, id) => [{ type: "SupplierFinance", id }]
    }),
    paySupplierDebt: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/suppliers/${id}/payments`, method: "POST", body }),
      invalidatesTags: (_, __, arg) => [{ type: "SupplierFinance", id: arg.id }, "Supplier", "Overview"]
    }),
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"]
    }),
    createProduct: builder.mutation({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Product", "Supplier", "Overview"]
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: "PUT", body }),
      invalidatesTags: ["Product", "Supplier", "Overview"]
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product", "Supplier", "Overview"]
    }),
    restockProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}/restock`, method: "POST", body }),
      invalidatesTags: ["Product", "Supplier", "Overview", "SupplierFinance"]
    }),
    getExpenses: builder.query({
      query: () => "/expenses",
      providesTags: ["Expense"]
    }),
    createExpense: builder.mutation({
      query: (body) => ({ url: "/expenses", method: "POST", body }),
      invalidatesTags: ["Expense"]
    }),
    updateExpense: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/expenses/${id}`, method: "PUT", body }),
      invalidatesTags: ["Expense"]
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({ url: `/expenses/${id}`, method: "DELETE" }),
      invalidatesTags: ["Expense"]
    }),
    getSales: builder.query({
      query: ({ limit = 100, period = "", from = "", to = "" } = {}) => {
        const params = new URLSearchParams();
        params.set("limit", String(limit));
        if (period) params.set("period", period);
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        return `/sales?${params.toString()}`;
      },
      providesTags: ["Sale"]
    }),
    getSaleReturns: builder.query({
      query: ({ limit = 200, period = "", from = "", to = "" } = {}) => {
        const params = new URLSearchParams();
        params.set("limit", String(limit));
        if (period) params.set("period", period);
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        return `/sales/returns?${params.toString()}`;
      },
      providesTags: ["Sale"]
    }),
    createSale: builder.mutation({
      query: (body) => ({ url: "/sales", method: "POST", body }),
      invalidatesTags: ["Sale", "Product", "Overview", "Customer", "CustomerLedger"]
    }),
    returnSale: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/sales/${id}/returns`, method: "POST", body }),
      invalidatesTags: ["Sale", "Product", "Overview", "Customer", "CustomerLedger"]
    }),
    getCustomers: builder.query({
      query: () => "/customers",
      providesTags: ["Customer"]
    }),
    createCustomer: builder.mutation({
      query: (body) => ({ url: "/customers", method: "POST", body }),
      invalidatesTags: ["Customer", "CustomerLedger", "Overview"]
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/customers/${id}`, method: "PUT", body }),
      invalidatesTags: ["Customer", "CustomerLedger", "Overview"]
    }),
    searchCustomers: builder.query({
      query: ({ q = "" } = {}) => `/customers/lookup?q=${encodeURIComponent(q)}`,
      providesTags: ["Customer"]
    }),
    getCustomerLedger: builder.query({
      query: (id) => `/customers/${id}/ledger`,
      providesTags: (_, __, id) => [{ type: "CustomerLedger", id }]
    }),
    payCustomerDebt: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/customers/${id}/payments`, method: "POST", body }),
      invalidatesTags: (_, __, arg) => [{ type: "CustomerLedger", id: arg.id }, "Customer", "Sale", "Overview"]
    })
  })
});

export const {
  useLoginMutation,
  useGetOverviewQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useLazyGetSupplierFinanceQuery,
  usePaySupplierDebtMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRestockProductMutation,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetSalesQuery,
  useGetSaleReturnsQuery,
  useCreateSaleMutation,
  useReturnSaleMutation,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useLazySearchCustomersQuery,
  useLazyGetCustomerLedgerQuery,
  usePayCustomerDebtMutation
} = baseApi;
