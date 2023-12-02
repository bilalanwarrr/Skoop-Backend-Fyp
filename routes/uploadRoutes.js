var express = require('express');
var router = express.Router();
var uploadController = require('../controllers/uploadController');

router.post('/upload-image', uploadController.multerUpload.array('images'), uploadController.returnedUrls)

module.exports = router;
