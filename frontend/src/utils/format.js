import { PRODUCT_UNITS } from "../constants/ui";

export function formatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString();
}

export function normalizeUnit(value) {
  const v = String(value || "").toLowerCase();
  return PRODUCT_UNITS.includes(v) ? v : "dona";
}

export function getCategoryName(product) {
  if (product?.categoryId && typeof product.categoryId === "object") return product.categoryId.name;
  return "Kategoriyasiz";
}

export function getCategoryId(product) {
  if (product?.categoryId && typeof product.categoryId === "object") return product.categoryId._id;
  if (typeof product?.categoryId === "string") return product.categoryId;
  return "";
}

export function getSupplierName(product) {
  if (product?.supplierId && typeof product.supplierId === "object") return product.supplierId.name;
  return "Yetkazib beruvchi yo'q";
}

export function getSupplierId(product) {
  if (product?.supplierId && typeof product.supplierId === "object") return product.supplierId._id;
  if (typeof product?.supplierId === "string") return product.supplierId;
  return "";
}

export function toDateInput(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}
