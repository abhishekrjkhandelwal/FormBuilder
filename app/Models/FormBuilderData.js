const mongoose =  require('mongoose');

const userSchema =  mongoose.Schema({
    name: {type: String, required: true},
});

const formBuilderSchema = mongoose.Schema({
    name: {type: String, required: true }, 
    email: {type: String, required: true},
    gender: {type: String},
    adhaarNumber: {type: String, required: true},
    country: {type: String}
});

const User =  mongoose.model('User', userSchema, 'user');
const userDetails =  mongoose.model('FormBuilder', formBuilderSchema, 'userDetails');

module.exports = {
    User: User,
    userDetails: userDetails
}