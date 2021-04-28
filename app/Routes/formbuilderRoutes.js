let express  = require('express');
const router = express.Router();
const FormBuilder = require('../Models/FormBuilderData');
const mongoose = require('mongoose');


 /** Api for post form data */
router.post('/post-form-data', (req, res) => {
    const formBuilder = new FormBuilder({
        _id:  new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email
    });
    formBuilder.save().then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
});

// API for get Form Data
router.get('/get-form-data', (req, res) => {
    FormBuilder.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: "Form Is created",
                posts: documents
            })
        })
        .catch(err => console.log(err));
});

module.exports = router;