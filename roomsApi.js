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
router.post('/checkout-url', async (req, res) => {
  const {instanceId, visitorId, metaSiteId} = req.query;

  const orderC = req.DBManager.db.collection(ordersCollection);
  const orders = await orderC.find({metaSiteId, visitorId}).toArray();
  const roomsC = req.DBManager.db.collection(roomsCollection);
  for (const order of orders) {
    order.roomDetails = await roomsC.findOne({roomId: order.orderId});
  }

  const instalactionC = req.DBManager.db.collection(installCollection);
  const installation = await instalactionC.findOne({instanceId});
  const refreshResponse = await axios.post(refreshAccessUrl, {    
    "grant_type": "refresh_token",
    "client_id": appId,
    "client_secret": appSecret,
    "refresh_token": installation.refresh_token

  })

  console.log('::::refreshResponse::', refreshResponse)

  const createResponse = axios.post('https://www.wixapis.com/ecom/v1/checkouts', {
    lineItems: orders.map(order => (
      {
        "id": order.orderId, 
        "quantity": order.quantity, 
        "description" : order.roomDetails.description, 
        "catalogReference":{
            appId, 
            "catalogItemId": order.orderId
            },
        "channelType": "UNSPECIFIED"
    }))
  }, {
    headers:{
        Authorization: refreshResponse.data.access_token
    }
  })

  console.log('createResponse:::', createResponse)
  res.send({})
});
router.get('/', async (req, res) => {
  const roomsC = req.DBManager.db.collection(roomsCollection);
  const rooms = await roomsC.find({}).project({_id:0}).toArray();
  res.json({rooms});
})
module.exports = router
