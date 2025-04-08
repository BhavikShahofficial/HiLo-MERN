const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  const getEffectivePrice = (product) =>
    product.salePrice && product.salePrice > 0
      ? Number(product.salePrice)
      : Number(product.price);
  try {
    const { category = [], brand = [], sortBy = "title-atoz" } = req.query;
    const normalizedSortBy = sortBy.toLowerCase();

    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    const products = await Product.find(filters).lean();

    // console.log(
    //   "Products (before sort):",
    //   products.map((p) => ({
    //     title: p.title,
    //     price: p.price,
    //     salePrice: p.salePrice,
    //   }))
    // );

    products.sort((a, b) => {
      const priceA = getEffectivePrice(a);
      const priceB = getEffectivePrice(b);

      switch (normalizedSortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "title-atoz":
          return a.title.localeCompare(b.title);
        case "title-ztoa":
          return b.title.localeCompare(a.title);
        default:
          return a.title.localeCompare(b.title);
      }
    });

    console.log(
      "Products (after sort):",
      products.map((p) => p.title)
    );

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something Went Wrong!" });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
