const mongoose = require('mongoose');
const { Schema } = mongoose;

main()
  .then(() => console.log("connection successful"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/relationships');

  await addCustomer();     // Add John Doe with Pizza & Burger
  await addCust();         // Add Jane Smith with Pasta
  await findCustomer();    // View all customers
  await delCust();         // Delete a customer by ID
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

  let order1 = await Order.findOne({ item: 'Pizza' }) || await Order.create({ item: 'Pizza', price: 10 });
  let order2 = await Order.findOne({ item: 'Burger' }) || await Order.create({ item: 'Burger', price: 8 });

  cust1.orders.push(order1._id, order2._id);

  let result = await cust1.save();
  console.log("Saved customer:", result);
};

const addCust = async () => {
  let newOrder = new Order({
    item: 'Pasta',
    price: 12.99
  });
  await newOrder.save();

  let newCust = new Customer({
    name: 'Jane Smith',
    orders: [newOrder._id]
  });

  await newCust.save();
  console.log("Added new customer with order:", newCust);
};

const findCustomer = async () => {
  let result = await Customer.find({}).populate('orders');
  console.log("Customers with orders:", result);
};

const delCust = async () => {
  // Use a valid ID from your DB; replace the below dummy ID
  const idToDelete = '60c72b2f9b1d8c001c8e4f1a'; // Replace with actual ObjectId
  try {
    let data = await Customer.findByIdAndDelete(idToDelete);
    if (data) {
      console.log("Deleted customer:", data);
    } else {
      console.log("No customer found with that ID.");
    }
  } catch (err) {
    console.error("Error deleting customer:", err.message);
  }
};
