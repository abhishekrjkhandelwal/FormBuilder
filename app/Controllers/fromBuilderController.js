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

const postData = (multer({storage: storage}).single("image"), (req, res) => {

    console.log('req.file', req.body.file)

    const user = new schema.User({
        name: req.body.name,
    });

    const userDetails = new schema.userDetails({
        name: req.body.formData.name,
        email: req.body.formData.email,
        gender: req.body.formData.gender,
        adhaarNumber: req.body.formData.adhaarNumber,
        country: req.body.formData.country
    });

    user.save(function (err, user) {
        if (err) return console.error(err);
        console.log(user + " saved to user collection.");
    })

    userDetails.save(function (err, userDetails) {
        if (err) return console.error(err);
        console.log(userDetails + " saved to userDetails collection.");
    })
})


const getData = (req, res) => {
    schema.userDetails.find()
    .then(documents => {
        console.log(documents);
        res.status(200).json({
            message: "Form Is created",
            posts: documents
        })
    })
    .catch(err => console.log(err));
}

const updateData = (req, res) => {
    const user = new schema.User({
        name: req.body.userName,
    });

    schema.User.aggregate([
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
                email: "$userD.email",
                gender: "$userD.gender",
                adhaarNumber: "$userD.adhaarNumber",
                country: "$userD.country",
            }
        }
    ])
    .then(
       
        setData = {
           name: req.body.formData.name,
           email: req.body.formData.email,
           gender: req.body.formData.gender,
           adhaarNumber: req.body.formData.adhaarNumber,
           country: req.body.formData.country
        },
         
        schema.userDetails.findOneAndUpdate({ name: user.name},
            {$set: setData},
            {new : true},
            (err, doc) => {
                 if(err) {
                     console.log("wrong when data updating");
                 }
                 console.log(doc);
              })
    );
}

const deleteData = (req, res) => {
    const user = new schema.User({
        name: req.query.name,
    });   

    console.log('name', req.query.name);

    schema.userDetails.deleteMany({name: req.query.name}, function(err) {
        if(err) {
            throw err;
        } else {
            console.log("deleted");
        }
    });
}

module.exports = {
    postData: postData,
    getData: getData,
    updateData: updateData,
    deleteData: deleteData
}