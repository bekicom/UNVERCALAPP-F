import { PRODUCT_UNITS } from "../constants/ui";

export function formatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  const rounded = Math.round(num * 100) / 100;
  const hasTiyin = Math.abs(rounded - Math.trunc(rounded)) > 0.000001;
  return rounded.toLocaleString(undefined, {
    minimumFractionDigits: hasTiyin ? 2 : 0,
    maximumFractionDigits: 2
  });
}

export function formatDisplayMoney(value, currency = "uzs", usdRate = 12171) {
  const amount = Number(value || 0);
  const rate = Number(usdRate || 0);
  if (currency === "usd") {
    const converted = rate > 0 ? amount / rate : 0;
    return `${formatMoney(converted)} $`;
  }
  return `${formatMoney(amount)} so'm`;
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
