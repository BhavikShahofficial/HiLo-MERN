const ProductReview = require("../../models/ProductReview");
const Product = require("../../models/Product");
const Order = require("../../models/Orders");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    // Validate reviewValue
    if (reviewValue < 1 || reviewValue > 5) {
      return res.status(400).json({
        message: "Review value must be between 1 and 5.",
        success: false,
      });
    }

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

    // Update the product's average rating incrementally
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
        success: false,
      });
    }

    // Incrementally update the average rating
    const totalReviews = product.totalReviews || 0;
    const totalRating = product.totalRating || 0;
    const newTotalRating = totalRating + reviewValue;
    const newTotalReviews = totalReviews + 1;

    const averageReview = newTotalRating / newTotalReviews;

    // Update product's average review and total reviews
    await Product.findByIdAndUpdate(productId, {
      averageReview,
      totalReviews: newTotalReviews,
      totalRating: newTotalRating,
    });

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

    let reviews;
    if (productId) {
      // Single product's reviews
      reviews = await ProductReview.find({ productId });
    } else {
      // All product reviews
      reviews = await ProductReview.find();
    }

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Failed to fetch reviews",
      success: false,
    });
  }
};

module.exports = { addProductReview, getProductReview };
