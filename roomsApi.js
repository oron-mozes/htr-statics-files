const express = require('express')
const router = express.Router()
const dbConnection = require('./dbConfig.js');
const roomsCollection = 'rooms';
const ordersCollection = 'orders';

const reservation = new Map([]);

router.use(express.json())
router.use(express.urlencoded())
router.use(dbConnection)

router.post('/reserve', async (req, res) => {
  const {metaSiteId, orderId, visitorId} = req.body;
  const orderC = req.DBManager.db.collection(ordersCollection);
  await orderC.update({metaSiteId, visitorId, orderId}, { $inc:{quantity: 1}}, {upsert: true})
  res.json({success: true});
})
router.post('/my-orders', async (req, res) => {
  const {metaSiteId, visitorId} = req.body;
  const orderC = req.DBManager.db.collection(ordersCollection);
  const orders = await orderC.find({metaSiteId, visitorId}).toArray();
  const roomsC = req.DBManager.db.collection(roomsCollection);
  for (const order in orders) {
    order.roomDetails = await roomsC.find({roomId: order.orderId}).project({_id:0}).toArray();
    console.log(order)
  }
  res.json({orders});
})
router.delete('/my-orders', async (req, res) => {
  const {metaSiteId, visitorId, orderId} = req.body;
  const orderC = req.DBManager.db.collection(ordersCollection);
  await orderC.update({metaSiteId, visitorId, orderId}, { $inc:{quantity: -1}})
  const order = await orderC.findOne({metaSiteId, visitorId, orderId})

  if(order.quantity <= 0) {
    await orderC.remove({metaSiteId, visitorId, orderId})
  }

  res.json({success: true});
})

router.get('/', async (req, res) => {
  const roomsC = req.DBManager.db.collection(roomsCollection);
  const rooms = await roomsC.find({}).project({_id:0}).toArray();
  console.log('able to get rooms', rooms)
  res.json({rooms});
})
module.exports = router
