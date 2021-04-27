let express  = require('express');
const router = express.Router();
const fromBuilderService = require('../services/userservice');


// API for get Form Data
router.get('/get-form-data', (req, res) => {
    fromBuilderService.getFromData(req.query, (data) => {
      res.send(data);
    });
});

 /** Api for post form data */
router.post('/post-form-data', (req, res) => {
    fromBuilderService.postFormData(req.body, (data) => {
        res.send(data);
    });
});

module.exports = router;
