const mongoose = require('mongoose');
const { Schema } = mongoose;

main()
  .then(() => console.log("connection successful"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/relationships');
  await addCustomer();      // Add a customer with orders
  await findCustomer();     // Fetch customers with populated orders
}

const orderSchema = new Schema({
  item: String,
  price: Number,
});

const customerSchema = new Schema({
  name: String,
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }]
});

const Order = mongoose.model('Order', orderSchema);
const Customer = mongoose.model('Customer', customerSchema);

const addCustomer = async () => {
  let cust1 = new Customer({
    name: 'John Doe',
  });

  let order1 = await Order.findOne({ item: 'Pizza' });
  let order2 = await Order.findOne({ item: 'Burger' });

  if (order1) cust1.orders.push(order1._id);
  if (order2) cust1.orders.push(order2._id);

  let result = await cust1.save();
  console.log("Saved customer:", result);
};

const findCustomer = async () => {
  let result = await Customer.find({}).populate('orders');
  console.log("Customers with orders:", result);
};
