import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true, trim: true },
    productModel: { type: String, default: "", trim: true },
    unit: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, min: 0, default: 0 },
    lineProfit: { type: Number, required: true, default: 0 }
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cashierUsername: { type: String, required: true, trim: true },
    items: { type: [saleItemSchema], required: true, default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentType: { type: String, enum: ["cash", "card", "click", "mixed"], required: true },
    payments: {
      cash: { type: Number, required: true, min: 0, default: 0 },
      card: { type: Number, required: true, min: 0, default: 0 },
      click: { type: Number, required: true, min: 0, default: 0 }
    },
    note: { type: String, trim: true, default: "" }
  },
  { timestamps: true }
);

saleSchema.index({ createdAt: -1 });

export const Sale = mongoose.model("Sale", saleSchema);
