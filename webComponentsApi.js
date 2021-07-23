const express = require('express')
const router = express.Router()
const fs = require('fs');

router.get('/roomsWidget.js', async (req, res) => {

  const {instanceId} = req.query;
  const content = JSON.parse(await fs.readFileSync('./jsTemplates/roomsWidget.js', 'utf8'));
  console.log('::content:: ', content)
  const finalContent = content.replace("{{instanceId}}", instanceId);
  res.setHeader('content-type', 'text/javascript');
  res.write(finalContent);
  res.end();
});

module.exports = router