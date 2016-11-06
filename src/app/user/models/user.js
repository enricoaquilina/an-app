var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    subscribedHubs: [{type: Schema.Types.ObjectId, ref: 'Hub'}]
});

userSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('User', userSchema);