const schema = require('../Models/FormBuilderData');

const postData = (req, res) => {
    const user = new schema.User({
        name: req.body.name,
    });

    const userDetails = new schema.userDetails({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        adhaarNumber: req.body.adhaarNumber,
        country: req.body.country
    });

    user.save(function (err, user) {
        if (err) return console.error(err);
        console.log(user + " saved to bookstor collection.");
    })

    userDetails.save(function (err, userDetails) {
        if (err) return console.error(err);
        console.log(userDetails + " saved to bookstore collection.");
    })
}


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

    const userDetails = new schema.userDetails({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        adhaarNumber: req.body.adhaarNumber,
        country: req.body.country
    });

    schema.User.aggregate([
        {
            $lookup:
            {
                from: `"${userDetails}"`,
                localField: "name",
                foreignField: "name",
                as: "userD"
            }
        },
        // {
        //     $unwind: "$userD"
        // },
    ])
    .then(userDetails => console.log(userDetails[0].userD));
}

module.exports = {
    postData: postData,
    getData: getData,
    updateData: updateData
}