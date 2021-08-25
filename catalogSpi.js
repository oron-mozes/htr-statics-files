const express = require('express');
const router = express.Router();

const dbConnection = require('./dbConfig.js');
const appId = '7cbc47b3-cfc6-4d20-a13d-40cd1521378b';
const roomsCollection = 'rooms';

router.use(express.json());
router.use(express.urlencoded());
router.use(dbConnection);


router.post('/get-catalog-items', async (req, res) => {
  const { currency, instanceId, catalogReferences } = req.body;

  const roomsMap = new Map([]);
  catalogReferences.forEach(({ catalogReference, quantity }) =>
    roomsMap.set(catalogReference.catalogItemId, quantity)
  );

  const roomsIds = Array.from(roomsMap.keys());
  const roomsC = req.DBManager.db.collection(roomsCollection);
  const rooms = await roomsC.find({ roomId: { $in: roomsIds } }).toArray();
//https://bo.wix.com/wix-docs/rest/drafts/catalog-spi/get-catalog-items
//https://github.com/wix-private/ecom/blob/dc2239a7893aac54e65e24951e7551d08bf2688e/server/wix-ecommerce-server/wix-ecommerce-catalog-spi/src/main/proto/com/wix/ecommerce/catalog_spi/api/v1/description_line.proto
  const response = {
    catalogItems: rooms.map((room) => ({
      catalogReference: {
        catalogItemId: room.roomId,
        appId,
      },
      data: {
        productName: {
          original: room.name,
          translated: room.name,
        },
        url: {
          relativePath: '/product-page/a-product',
          url: 'https://mysite.com/product-page/a-product',
        },
        price: room.price,
        fullPrice: room.price,
        descriptionLines: [
          {
            name: {
              original: room.description,
              translated: room.description,
            },
            plainTextValue: {
              original: room.description,
              translated: room.description,
            }
          },
        ],
        media: {
          url: room.media,
          height: 100, //Original image height.
          width: 100, //Original image width.
          altText: room.description,
        },
        quantityAvailable: roomsMap.get(room.roomId),
        itemType: {
          preset: 'DIGITAL',
        },
        fulfillerId: room.roomId,
      },
    })),
  };

  res.json(response);
});
module.exports = router;
