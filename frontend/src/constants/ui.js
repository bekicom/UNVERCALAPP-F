export const PRODUCT_UNITS = ["dona", "kg", "blok", "pachka", "qop"];

const FRACTIONAL_QUANTITY_UNITS = new Set(["kg"]);

export function allowsFractionalQuantity(unit) {
  return FRACTIONAL_QUANTITY_UNITS.has(String(unit || "").toLowerCase());
}

export function getQuantityStep(unit) {
  return allowsFractionalQuantity(unit) ? "0.01" : "1";
}

export function getQuantityMin(unit) {
  return allowsFractionalQuantity(unit) ? "0.01" : "1";
}

export function getQuantityInputMode(unit) {
  return allowsFractionalQuantity(unit) ? "decimal" : "numeric";
}

export const sidebarGroups = [
  { title: "ASOSIY", items: ["Bosh sahifa"] },
  { title: "TIZIM", items: ["Xodimlar", "Mahsulotlar", "Kategoriyalar", "Yetkazib beruvchilar", "Sozlamalar"] },
  { title: "SAVDO", items: [ "Sotuv tarixi", "Clientlar" ] },
  { title: "MOLIYA", items: ["Xarajatlar",  "Qaytarib olish"] }
];

export const MENU_ICONS = {
  "Bosh sahifa": "home",
  "Xodimlar": "users",
  "Zavod": "factory",
  "Mahsulotlar": "box",
  "Kategoriyalar": "clipboard",
  "Yetkazib beruvchilar": "truck",
  "Sozlamalar": "clipboard",
  "Clientlar": "user",
  "Mijozlar": "user",
  "Kirimlar": "download",
  "Sotuv": "cash",
  "Sotuv tarixi": "history",
  "Agentlar": "briefcase",
  "Xarajatlar": "wallet",
  "Buyurtmalar": "clipboard",
  "Qaytarib olish": "rotate"
};
