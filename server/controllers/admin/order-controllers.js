const Orders = require("../../models/Orders");

const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status && status !== "all") {
      query.orderStatus = status;
    }

    const orders = await Orders.find(query);

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

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Orders.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getAllOrders,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  deleteOrder,
};
