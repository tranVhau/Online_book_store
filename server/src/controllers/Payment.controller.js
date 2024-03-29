const { mongoose } = require("mongoose");
const { Orders, OrdersItems, EBooks } = require("../models");
const emailSender = require("../configs/emailSender");
const Paypal = require("../services/Paypal");

// transaction.
const newOrder = async (transaction_id, items, email, user_id) => {
  // const { transaction_id, items, email, user_id } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const orderIDofItem = items.map((item) => item._id);

    const order = new Orders({
      transaction_id: transaction_id,
      user_id: user_id,
      email: email,
      items: orderIDofItem,
    });
    const results = await order.save();
    const orderItemInfo = items.map((obj) => {
      return {
        item: obj._id,
        order_id: results._id,
        price: obj.price,
        discount: obj.discount,
      };
    });

    orderItemInfo.forEach(async (item) => {
      const order_item = new OrdersItems({
        ...item,
      });
      await order_item.save();
    });

    const itemArr = items.map((item) => item._id);
    const itemInfo = await EBooks.find().where("_id").in(itemArr).exec();
    const resource = itemInfo.map((info) => ({
      name: info.name,
      url: info.source,
    }));
    await emailSender(email, resource);
    session.commitTransaction();
    // res.status(201).json({ message: "thank you for your purchase" });
  } catch (error) {
    session.abortTransaction();
    // res.status(500).json({ message: "failed" });
  } finally {
    session.endSession();
  }
};

// for paypal payment:
const createOrder = async (req, res) => {
  const order = req.body;
  try {
    const response = await Paypal.createOrder(order);
    res.json(response);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

const captureOrder = async (req, res) => {
  const { items, email, user_id } = req.body;

  try {
    const { orderID } = req.params;
    const response = await Paypal.capturePayment(orderID);
    await newOrder(null, items, email, user_id);
    res.json(response);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};

module.exports = { createOrder, captureOrder };
