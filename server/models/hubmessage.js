var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user');

var messageSchema = new Schema({
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    parentHub: {type: Schema.Types.ObjectId, ref: 'Hub'},
    creationDate: {type: Date, default: Date.now}
});

// messageSchema.post('remove', function(doc){
//     User.findById(doc.user, function(err, usr){
//         // usr.messages.splice(usr.messages.indexOf(doc));
//         usr.messages.pull(doc);
//         usr.save();
//     })
// });
module.exports = mongoose.model('HubMessage', messageSchema);