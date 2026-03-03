import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = "http://localhost:4000/api";

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
  tagTypes: ["Overview", "User", "Category", "Supplier", "Product", "Expense", "SupplierFinance", "Sale"],
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
    createSale: builder.mutation({
      query: (body) => ({ url: "/sales", method: "POST", body }),
      invalidatesTags: ["Sale", "Product", "Overview"]
    })
  })
});

export const {
  useLoginMutation,
  useGetOverviewQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
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
  useCreateSaleMutation
} = baseApi;
