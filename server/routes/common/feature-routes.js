const express = require("express");
const {
  addFeatureImage,
  getFeatureImage,
} = require("../../controllers/common/feature-controllers");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImage);

module.exports = router;
