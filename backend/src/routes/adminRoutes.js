import { Router } from "express";
import { authMiddleware } from "../authMiddleware.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

const router = Router();

router.get("/overview", authMiddleware, async (req, res) => {
  const [users, products] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments()
  ]);

  return res.json({
    message: "Admin panelga xush kelibsiz",
    stats: {
      users,
      products
    },
    admin: req.user
  });
});

export default router;
