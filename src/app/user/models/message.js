var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var messageSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    content: {type: String, required: true}
});

messageSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('Message', messageSchema);