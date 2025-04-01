const express = require("express");
const {
  addToCart,
  fetchCartItem,
  updateCartItemQuantity,
  deleteCartItem,
} = require("../../controllers/shop/cart-controllers");
const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItem);
router.put("/update", updateCartItemQuantity);
router.delete("/:userId/:productId", deleteCartItem);

module.exports = router;
