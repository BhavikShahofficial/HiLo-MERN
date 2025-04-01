const ProductReview = require("../../models/ProductReview");
const Product = require("../../models/Product");
const Order = require("../../models/Orders");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    // Check if user has purchased the product
    const order = await Order.findOne({
      userId: userId,
      "cartItems.productId": productId,
      orderStatus: "Confirmed",
    });

    if (!order) {
      return res.status(403).json({
        message: "You need to purchase the product to review it.",
        success: false,
      });
    }

    // Check if user has already reviewed the product
    const checkExistingReview = await ProductReview.findOne({
      productId: productId,
      userId: userId,
    });

    if (checkExistingReview) {
      return res.status(403).json({
        message: "You have already reviewed this product.",
        success: false,
      });
    }

    // Create and save new review
    const newReview = new ProductReview({
      productId: productId,
      userId: userId,
      userName: userName,
      reviewMessage: reviewMessage,
      reviewValue: reviewValue,
    });

    await newReview.save();

    // Update average rating for product
    const reviews = await ProductReview.find({ productId });
    const totalReviewLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    return res.status(201).json({
      data: newReview,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Failed to add product review",
      success: false,
    });
  }
};

const getProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({ productId });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
      success: false,
    });
  }
};
module.exports = { addProductReview, getProductReview };
