var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
    username: {type: String, required:true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type:String, default: ''},
    lastName: {type: String, default: ''},
    isAdmin: {type: Boolean, default: false},
    subscribedHubs: [{type: Schema.Types.ObjectId, ref: 'Hub'}],
    ownedHubs: [{type: Schema.Types.ObjectId, ref: 'Hub'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

userSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('User', userSchema);