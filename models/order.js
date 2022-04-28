const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
}, {_id: false});

const orderSchema = new mongoose.Schema(
  {
    items: [
      itemSchema
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
  }
);

module.exports = mongoose.model("Order", orderSchema);
