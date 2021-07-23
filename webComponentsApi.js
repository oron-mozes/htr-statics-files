const express = require('express')
const router = express.Router()
const fs = require('fs');

router.get('/roomsWidget.js', async (req, res) => {

  const {instanceId} = req.query;
  fs.readFile('./jsTemplates/roomsWidget.js', (err, data) => {
    if(err) {
      console.log(err);
    }
    const content = data.replace("{{instanceId}}", instanceId);
    res.setHeader('content-type', 'text/javascript');
    res.write(content);
    res.end();
  });
});

module.exports = router