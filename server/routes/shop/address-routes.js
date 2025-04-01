const express = require("express");
const {
  addNewAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controllers");
const router = express.Router();

router.post("/add", addNewAddress);
router.put("/update/:userId/:addressId", editAddress);
router.delete("/delete/:userId/:addressId", deleteAddress);
router.get("/get/:userId", fetchAllAddress);

module.exports = router;
