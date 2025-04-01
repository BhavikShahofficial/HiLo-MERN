const express = require("express");
const {
  handleImageUpload,
  addProduct,
  fetchProduct,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/product-controllers");
const router = express.Router();
const { upload } = require("../../helper/cloudinary");

router.post("/image-upload", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.get("/get", fetchProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
