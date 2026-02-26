const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

// Route for the main download logic
router.post('/', downloadController.getMedia);

// Route for the image proxy
router.get('/proxy', downloadController.proxyMedia);

module.exports = router;