const express = require('express')
const router = express.Router()
const dbConnection = require('./dbConfig.js');
const roomsCollection = 'rooms';
const ordersCollection = 'orders';
const installCollection = 'installs';
const appId = '7cbc47b3-cfc6-4d20-a13d-40cd1521378b';
const refreshAccessUrl = 'https://www.wix.com/oauth/access';
const appSecret = 'f3d6e2dd-3d64-4878-b523-624bd20772c1';
const axios = require('axios');

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
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
  for (const order of orders) {
    order.roomDetails = await roomsC.findOne({roomId: order.orderId});
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
router.post('/create-cart', async (req, res) => {
  const {authorization,} = req.headers;
  const {metaSiteId, visitorId} = req.body;
  const orderC = req.DBManager.db.collection(ordersCollection);
  const orders = await orderC.find({metaSiteId, visitorId}).toArray();
  const roomsC = req.DBManager.db.collection(roomsCollection);
  for (const order of orders) {
    order.roomDetails = await roomsC.findOne({roomId: order.orderId});
  }

  
  const lineItems = orders.map(order => (
    {
      "id": order.orderId, 
      "quantity": order.quantity, 
      "description" : order.roomDetails.description, 
      "catalogReference":
      {
        appId, 
        "catalogItemId": order.orderId
      },

  }));
  axios.post('https://www.wixapis.com/ecom/v1/checkouts', {
    lineItems,
    "channelType": "UNSPECIFIED"
  }, {
    headers:{
        Authorization: authorization
    }
  }).then(response => {
    console.log('response::', response);
    res.send({});
  }).catch(e => {
    console.log(e);
    res.send({});
  })

});
router.get('/', async (req, res) => {
  const roomsC = req.DBManager.db.collection(roomsCollection);
  const rooms = await roomsC.find({}).project({_id:0}).toArray();
  res.json({rooms});
})
module.exports = router
