const mongoose =  require('mongoose');

const formBuilderSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {type: String, required: true }
});

module.exports = mongoose.model('FormBuilder', formBuilderSchema)