const paypal = require("../../helper/paypal");
const Orders = require("../../models/Orders");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => {
              return {
                name: item.title,
                sku: item.productId,
                price: item.price.toFixed(2),
                currency: "USD",
                quantity: item.quantity,
              };
            }),
          },
          amount: {
            total: totalAmount.toFixed(2),
            currency: "USD",
          },
          description: "Payment for order #1234",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ message: "Error creating payment" });
      } else {
        const newlyCreatedOrder = new Orders({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
          cartId,
        });
        await newlyCreatedOrder.save();
        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;
        res.status(201).json({
          message: "Payment created successfully",
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Orders.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }

    // Execute payment via PayPal
    paypal.payment.execute(
      paymentId,
      { payer_id: payerId },
      async (error, payment) => {
        if (error) {
          console.error("Payment execution error:", error.response);
          return res.status(400).json({
            message: "Payment execution failed",
            success: false,
          });
        } else {
          // Update order
          order.paymentStatus = "Paid";
          order.orderStatus = "Confirmed";
          order.paymentId = paymentId;
          order.payerId = payerId;

          // Reduce stock
          for (let item of order.cartItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
              return res.status(404).json({
                message: `Product not found: ${item.title}`,
                success: false,
              });
            }

            product.totalStock -= item.quantity;
            await product.save();
          }

          // Clear cart
          await Cart.findByIdAndDelete(order.cartId);
          await order.save();

          return res.status(200).json({
            message: "Payment captured successfully",
            success: true,
            data: order,
          });
        }
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const query = { userId };
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Orders.find(query);

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found", success: false });
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

const getOrderDetails = async (req, res) => {
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

module.exports = {
  capturePayment,
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
};
