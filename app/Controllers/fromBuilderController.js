const schema = require('../Models/FormBuilderData');
const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req , file, cb) => {
        const isValid  = MIME_TYPE_MAP(file.mimetype);
        let error = new Error("Invalid mime type");
        if(isValid) {
            error = null;
        }
        cb(null, "../../app/images/");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP(file.mimetype);
        cb(null, name + '-', + Date.now() + '.' + ext);
    }
});

/** Post fromData */
const postData = (multer({storage: storage}).single("image"), async (req, res) => {

    
    const user = new schema.User({
        name: req.body.formData.name,
        email: req.body.formData.email,
        gender: req.body.formData.gender,
        createdAt: req.body.formData.createdAt
    });
    const userDetails = new schema.userDetails({
        name: req.body.formData.name,
        birthDate: req.body.formData.birthDate,
        email: req.body.formData.email,
        adhaarNumber: req.body.formData.adhaarNumber,
        address: req.body.formData.address,
        mobileno: req.body.formData.mobileno,
        country: req.body.formData.country
    });

    await user.save(function (err, user) {
        if (err) return console.error(err);
        console.log(user + " saved to user collection.");
    })

    await userDetails.save(function (err, userDetails) {
        if (err) return console.error(err);
        console.log(userDetails + " saved to userDetails collection.");
    })
})

/** fetch fromData */
const getData = async (req, res) => {
    await schema.User.aggregate([
        {
            $lookup:
            {
                from: "userDetails",
                localField: "name",
                foreignField: "name",
                as: "userD"
            }
        },
        {
            $unwind: "$userD"
        },
        {
       $project : {
                _id: 1,
                name: 1,
                createdAt: 1,
                email: 1,
                gender: 1,
                birthDate: "$userD.birthDate",
                adhaarNumber: "$userD.adhaarNumber",
                address: "$userD.address",
                mobileno: "$userD.mobileno",
                country: "$userD.country",
            },
        }
    ]) 
    .then(documents => {
        const response = {
            count: documents.length,
            formdata: documents.map(doc => {
                return {
                    message: "fetch form data",
                    name: doc.name,
                    email: doc.email,
                    gender: doc.gender,
                    adhaarNumber: doc.adhaarNumber,
                    birthDate: doc.birthDate,
                    address: doc.address,
                    mobileno: doc.mobileno,
                    country: doc.country,
                    createdAt: doc.createdAt,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/get-form-data/' + doc._id,
                    },
                }
            })
        }
        console.log(response);
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err,
            errorhandler: {
                request: {
                    message: 'data not found in database',
                    type: 'GET',
                    url: 'http://localhost:3000/get-form-data/',
                }
            }
        })
    });
}

/** Update formData */
const updateData = async (req, res) => {
    const user = new schema.User({
        name: req.body.userName,
    });

   await schema.User.aggregate([
        {
            $lookup:
            {
                from: "userDetails",
                localField: "name",
                foreignField: "name",
                as: "userD"
            }
        },
        {
            $unwind: "$userD"
        },
        {
       $project : {
                name: 1,
                createdAt: 1,
                email: 1,
                gender: 1,
                adhaarNumber: "$userD.adhaarNumber",
                address: "$userD.address",
                mobileno: "$userD.mobileno",
                country: "$userD.country",
            },
        }
    ])
    .then(     
        setData = {
           name: req.body.formData.name,
           email: req.body.formData.email,
           gender: req.body.formData.gender, 
           adhaarNumber: req.body.formData.adhaarNumber,
           address: req.body.formData.address,
           mobileno: req.body.formData.mobileno,
           birthDate: req.body.formData.birthDate,
           country: req.body.formData.country,
        },
         
       await schema.userDetails.findOneAndUpdate({ name: user.name},
            {$set: setData},
            {new : true},
            (err, doc) => {
                 if(err) {
                     console.log("wrong when data updating");
                 }
                 console.log(doc);
              }).then(documents => {
                const response = {
                    count: documents.length,
                    formdata: documents.map(doc => {
                        return {
                            message: "update form data",
                            _id: doc._id,
                            name: doc.name,
                            email: doc.email,
                            gender: doc.gender,
                            adhaarNumber: doc.adhaarNumber,
                            country: doc.country,
                            request: {
                                type: 'PUT',
                                url: 'http://localhost:3000//update-form-data/' + doc._id,
                            },
                        }
                    })
                }
                res.status(200).json(response);
            }).catch(err => {
                res.status(500).json({
                    message: "Data not updated",
                    error: err,
                    errorhandler: {
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/get-form-data/',
                        }
                    }
                })
            })
    );
}

/** Delete fromData */
const deleteData = async (req, res) => {
    const user = new schema.User({
        name: req.query.name,
    });   

   await schema.userDetails.deleteMany({name: req.query.name}, function(err) {
        if(err) {
            throw err;
        } else {
            console.log("deleted");
        }
    }).then(documents => {
        const response = {
            count: documents.length,
            message: "user Details is deleted",
            formdata: documents.map(doc => {
                return {
                    request: {
                        type: 'Delete',
                        url: 'http://localhost:3000//delete-form-data/' + doc._id,
                        data: { name: 'String', email: 'String', gender: 'String', adhaarNumber: "String", country: "String" }
                    },
                }
            })
        }
        res.status(200).json(response);
    }).catch(err => {
        res.status(500).json({
            message: "data not deleted",
            error: err,
            errorhandler: {
                request: {
                    type: 'Delete',
                    url: 'http://localhost:3000/delete-form-data/',
                }
            }
        })
    })
}

module.exports = {
    postData: postData,
    getData: getData,
    updateData: updateData,
    deleteData: deleteData
}