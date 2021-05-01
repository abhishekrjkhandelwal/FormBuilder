let express  = require('express');
const router = express.Router();
const formBuilderController = require('../Controllers/fromBuilderController');

 /** Api for post form data */
router.post('/post-form-data', formBuilderController.postData);

// API for get Form Data
router.get('/get-form-data', formBuilderController.getData);

module.exports = router;