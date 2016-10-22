var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user');

var hubSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    moderators: [{type: Schema.Types.ObjectId, ref: 'User'}],
    subscribedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    hubMessages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

// messageSchema.post('remove', function(doc){
//     User.findById(doc.user, function(err, usr){
//         // usr.messages.splice(usr.messages.indexOf(doc));
//         usr.messages.pull(doc);
//         usr.save();
//     })
// });
module.exports = mongoose.model('Hub', hubSchema);
