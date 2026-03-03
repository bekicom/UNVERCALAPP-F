import { Router } from "express";
import { authMiddleware } from "../authMiddleware.js";
import { Product } from "../models/Product.js";
import { Sale } from "../models/Sale.js";

const router = Router();
const PAYMENT_TYPES = ["cash", "card", "click", "mixed"];

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

function normalizeItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];
  const merged = new Map();

  for (const it of rawItems) {
    const productId = String(it?.productId || "").trim();
    const quantity = Number(it?.quantity);
    if (!productId || !Number.isFinite(quantity) || quantity <= 0) continue;
    merged.set(productId, roundMoney((merged.get(productId) || 0) + quantity));
  }

  return [...merged.entries()].map(([productId, quantity]) => ({ productId, quantity }));
}

function normalizePayments(raw) {
  return {
    cash: roundMoney(Math.max(0, Number(raw?.cash) || 0)),
    card: roundMoney(Math.max(0, Number(raw?.card) || 0)),
    click: roundMoney(Math.max(0, Number(raw?.click) || 0))
  };
}

router.get("/", authMiddleware, async (req, res) => {
  const limitRaw = Number(req.query?.limit);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0
    ? Math.min(Math.floor(limitRaw), 300)
    : 100;

  const period = String(req.query?.period || "").toLowerCase();
  const from = String(req.query?.from || "");
  const to = String(req.query?.to || "");
  const query = {};

  const now = new Date();
  if (period === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query.createdAt = { $gte: start, $lt: end };
  } else if (period === "yesterday") {
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(end);
    start.setDate(start.getDate() - 1);
    query.createdAt = { $gte: start, $lt: end };
  } else if (period === "7d") {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    query.createdAt = { $gte: start };
  } else if (period === "30d") {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    query.createdAt = { $gte: start };
  } else if (from || to) {
    query.createdAt = {};
    if (from) {
      const start = new Date(from);
      if (!Number.isNaN(start.getTime())) query.createdAt.$gte = start;
    }
    if (to) {
      const end = new Date(to);
      if (!Number.isNaN(end.getTime())) {
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }
    if (!query.createdAt.$gte && !query.createdAt.$lte) delete query.createdAt;
  }

  const sales = await Sale.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const summary = sales.reduce((acc, sale) => {
    const total = Number(sale.totalAmount || 0);
    const cash = Number(sale.payments?.cash || 0);
    const card = Number(sale.payments?.card || 0);
    const click = Number(sale.payments?.click || 0);
    const profit = (sale.items || []).reduce((s, it) => s + Number(it.lineProfit || 0), 0);
    return {
      totalSales: acc.totalSales + 1,
      totalRevenue: roundMoney(acc.totalRevenue + total),
      totalCash: roundMoney(acc.totalCash + cash),
      totalCard: roundMoney(acc.totalCard + card),
      totalClick: roundMoney(acc.totalClick + click),
      totalProfit: roundMoney(acc.totalProfit + profit)
    };
  }, {
    totalSales: 0,
    totalRevenue: 0,
    totalCash: 0,
    totalCard: 0,
    totalClick: 0,
    totalProfit: 0
  });

  return res.json({ sales, summary });
});

router.post("/", authMiddleware, async (req, res) => {
  const items = normalizeItems(req.body?.items);
  const paymentType = String(req.body?.paymentType || "").trim().toLowerCase();
  const note = String(req.body?.note || "").trim();

  if (items.length < 1) {
    return res.status(400).json({ message: "Sotuv uchun kamida 1 ta mahsulot kerak" });
  }
  if (!PAYMENT_TYPES.includes(paymentType)) {
    return res.status(400).json({ message: "To'lov turi noto'g'ri" });
  }

  const productIds = items.map((it) => it.productId);
  const products = await Product.find({ _id: { $in: productIds } })
    .select("_id name model unit quantity retailPrice purchasePrice")
    .lean();

  if (products.length !== items.length) {
    return res.status(400).json({ message: "Ba'zi mahsulotlar topilmadi" });
  }

  const productMap = new Map(products.map((p) => [String(p._id), p]));
  const saleItems = [];

  for (const reqItem of items) {
    const product = productMap.get(reqItem.productId);
    if (!product) {
      return res.status(400).json({ message: "Mahsulot topilmadi" });
    }

    const currentQty = Number(product.quantity) || 0;
    if (reqItem.quantity > currentQty) {
      return res.status(409).json({
        message: `${product.name} uchun qoldiq yetarli emas (${currentQty})`
      });
    }

    const unitPrice = Number(product.retailPrice) || 0;
    const costPrice = Number(product.purchasePrice) || 0;
    const lineTotal = roundMoney(unitPrice * reqItem.quantity);
    const lineProfit = roundMoney((unitPrice - costPrice) * reqItem.quantity);
    saleItems.push({
      productId: product._id,
      productName: product.name,
      productModel: product.model || "",
      unit: product.unit,
      quantity: reqItem.quantity,
      unitPrice,
      lineTotal,
      costPrice,
      lineProfit
    });
  }

  const totalAmount = roundMoney(saleItems.reduce((sum, it) => sum + it.lineTotal, 0));
  const payments = normalizePayments(req.body?.payments);

  if (paymentType === "cash") {
    payments.cash = totalAmount;
    payments.card = 0;
    payments.click = 0;
  } else if (paymentType === "card") {
    payments.cash = 0;
    payments.card = totalAmount;
    payments.click = 0;
  } else if (paymentType === "click") {
    payments.cash = 0;
    payments.card = 0;
    payments.click = totalAmount;
  } else {
    const sum = roundMoney(payments.cash + payments.card + payments.click);
    if (Math.abs(sum - totalAmount) > 0.01) {
      return res.status(400).json({ message: "Aralash to'lov summasi jami summaga teng bo'lishi kerak" });
    }
  }

  const applied = [];
  for (const item of saleItems) {
    const updated = await Product.updateOne(
      { _id: item.productId, quantity: { $gte: item.quantity } },
      { $inc: { quantity: -item.quantity } }
    );

    if (updated.modifiedCount !== 1) {
      for (const rollback of applied) {
        await Product.updateOne({ _id: rollback.productId }, { $inc: { quantity: rollback.quantity } });
      }
      return res.status(409).json({ message: `${item.productName} qoldig'i yetarli emas` });
    }
    applied.push({ productId: item.productId, quantity: item.quantity });
  }

  const sale = await Sale.create({
    cashierId: req.user.id,
    cashierUsername: req.user.username,
    items: saleItems,
    totalAmount,
    paymentType,
    payments,
    note
  });

  return res.status(201).json({ sale });
});

export default router;
