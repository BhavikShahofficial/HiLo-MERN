const Orders = require("../../models/Orders");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find({});

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.findById(id);

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await Orders.findById(id);

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }
    await Orders.findByIdAndUpdate(id, { orderStatus });
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports = { getAllOrders, getOrderDetailsForAdmin, updateOrderStatus };
