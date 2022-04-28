const { ConversationV3, conversation } = require("@assistant/conversation");
const Order = require("../models/order");

// Init the webhook entry point
const app = conversation({ debug: false });
/**
 * @description add an element to the array
 * @param {ConversationV3} conv
 */
app.handle("add_elements", async (conv) => {
  const { pizza, quantity } = conv.session.params;

  //create order elment
  const order = { name: pizza, quantity: quantity };

  if (conv.session.params.currentOrder.length > 0)
    conv.session.params.currentOrder.push(order);
  else conv.session.params.currentOrder = [order];

  //reset variables
  conv.session.params.pizza = null;
  conv.session.params.quantity = null;
});

app.handle("close_order", async (conv) => {
  const { currentOrder } = conv.session.params;
  conv.session.params.currentOrder = null;

  //save the order on db
  await Order.create({
    items: currentOrder,
  });

  //set a variable to set the response
  currentOrder.forEach((element, index) => {
    if (currentOrder.length === index + 1)
      return (conv.session.params.listToSay +=
        element.quantity + " " + element.name);
    conv.session.params.listToSay +=
      element.quantity + " " + element.name + ",";
  });
});

//set initial values for each variables
app.handle("start_order", async (conv) => {
  conv.session.params.currentOrder = [];
  conv.session.params.pizza = null;
  conv.session.params.quantity = null;
  conv.session.params.listToSay = "";
});

module.exports = app;
