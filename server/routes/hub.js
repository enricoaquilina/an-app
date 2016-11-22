var express = require('express');
var router = express.Router();
var token = require('jsonwebtoken');

var Hub = require('../models/hub');
var User = require('../models/user');
var HubMessage = require('../models/hubmessage');

//get all hubs
router.get('/', function(req, res, next){
    var decoded = token.decode(req.query.token);    
    
    Hub.find()
        .populate('owner', 'username email firstName lastName')
        .exec(function(err, docs) {
            if(err) {
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: err
                })
            }
            if(decoded && decoded.user._id) {
                User.findOne({_id: decoded.user._id}, function(err, doc){
                    if(err){
                        return res.status(404).json({
                            title: 'We are sorry!',
                            error: err
                        })
                    }
                    //filtering out the 'unnecessary' hubs
                    let subscribedHubs = doc.subscribedHubs;
                    subscribedHubs.forEach(function(hub) {
                        let hubIndex = docs.findIndex(h => h._id == hub.toString());
                        hubIndex > -1 ? docs.splice(hubIndex, 1) : docs;
                    }) 
                    let ownedHubs = doc.ownedHubs;
                    ownedHubs.forEach(function(hub) {
                        let hubIndex = docs.findIndex(h => h._id == hub.toString());
                        hubIndex > -1 ? docs.splice(hubIndex, 1) : docs;
                    })  

                    return res.status(200).json({
                        message: 'success',
                        obj: docs
                    });

                })
            }else{
                res.status(200).json({
                    message: 'success',
                    obj: docs
                });
            }
        })
})
// router.use('/', function(req, res, next){
//     token.verify(req.query.token, 'd8f6b7a3-d98d-4f0a-88a2-ff90e26a6e70', function(err, decoded){
//         if(err){
//             return res.status(401).json({
//                 title: 'Not authorized',
//                 error: err
//             });
//         }
//         next();
//     })
// })

router.post('/ownedhubs', function(req, res, next){
    var decoded = token.decode(req.query.token);
    User.findById(decoded.user._id, function(err, doc){
        if(err){
            return res.status(404).json({
                title: 'We are sorry!',
                error: err
            });
        }
        var hub = new Hub({
            title: req.body.title,
            description: req.body.description,
            owner: doc
        });
        hub.save(function(err, result){
            if(err){
                if(err.errmsg.startsWith('E11000')){
                    return res.status(404).json({
                        title: 'We are sorry!',
                        error: { message: 'There already is a hub with the same title!' }
                    });
                }
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: err
                });                
            }
            doc.ownedHubs.push(result);
            doc.save();
            res.status(201).json({
                message: 'The hub has been saved',
                obj: result
            });
        })
    })
})
router.delete('/:id', function(req, res, next) {
    var decoded = token.decode(req.query.token);
    Hub.findById(req.params.id, function(err, doc){
        if(err) {
            return res.status(404).json({
                title: 'We are sorry!',
                error: err
            });
        }
        if(!doc) {
            return res.status(404).json({
                title: 'The hub was not found!',
                error: err
            });
        }
        if(decoded.user._id != doc.owner){
            return res.status(401).json({
                title: 'We are sorry!',
                error: err
            });
        }
        //before removing, make sure to remove from users' subscribed hubs
        User.findById(decoded.user._id, function(err, owner){
            if(err){
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: err
                });
            }
            //remove from owner's owned hubs
            let hubIndex = owner.ownedHubs.findIndex(h => h == doc._id.toString());
            hubIndex > -1 ? owner.ownedHubs.splice(hubIndex, 1) : owner;
            owner.save();

            //remove from users' subbed hubs
            User.find({subscribedHubs: {
                _id: doc._id
            }}, function(err, subscribedUsers) {
                subscribedUsers.forEach(u => {
                    let hubIndex = u.subscribedHubs.findIndex(h => h == doc.id.toString());
                    u.subscribedHubs.splice(hubIndex, 1);              
                    u.save();
                })
            })
            doc.remove(function(err, doc) {
                if(err) {
                    return res.status(404).json({
                        title: 'We are sorry!',
                        error: err
                    })
                }
                res.status(200).json({
                    title: 'Document has been removed'
                })
            });
        })
    });
});
router.patch('/:id',function(req,res,next){
    var decoded = token.decode(req.query.token);
    Hub.findById(req.params.id, function(err, doc){
        if(err) {
            return res.status(404).json({
                title: 'We are sorry!',
                error: err
            });
        }
        if(!doc) {
            return res.status(404).json({
                title: 'We are sorry!',
                error: err
            });
        }
        if(decoded.user._id != doc.owner) {
            return res.status(401).json({
                title: 'We are sorry!',
                error: err
            });
        }
        doc.title = req.body.title;
        doc.description = req.body.description;
        doc.save(function(err, result) {
            if(err) {
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Hub saved successfully',
                obj: result
            })
        });
    })
})
router.patch('/subscribedhubs/:id',function(req, res, next) {
    var decoded = token.decode(req.query.token);
    User.findById(req.params.id, function(err, doc){
        if(err){
            return res.status(404).json({
                title: 'We are sorry!',
                error: err
            });
        }
        if(!doc) {
            return res.status(404).json({
                title: 'We are sorry!',
                error: err
            });
        }
        // if(decoded.user._id != doc.owner){
        //     return res.status(401).json({
        //         title: 'We are sorry!',
        //         error: err
        //     });
        // }
        let hub = new Hub();
        hub._id = req.body._id;
        hub.description = req.body.description;
        hub.title = req.body.title;
        hub.owner = {
            _id: req.body.owner._id,
            username: req.body.owner.username
        };

        Hub.findById(req.body._id, function(err, subscribedHub) {
            if(err) {
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: err
                });
            }
            let hubIndex = doc.subscribedHubs.indexOf(subscribedHub._id);
            if(hubIndex == -1) {
                doc.subscribedHubs.push(subscribedHub);
                doc.save();

                res.status(201).json({            
                    message: 'You have successfully subscribed!',
                    obj: hub
                });
            }else if(hubIndex > -1){
                doc.subscribedHubs.splice(hubIndex, 1);
                doc.save();
                res.status(201).json({
                    message: 'You have successfully unsubscribed!',
                    obj: doc
                });
            }
        })
    })
})
module.exports = router;