var express = require('express');
var router = express.Router();
var token = require('jsonwebtoken');

var Hub = require('../models/hub');
var User = require('../models/user');
var HubMessage = require('../models/hubmessage');

router.get('/:id', function(req, res, next){
    Hub.findOne({title: req.params.id}, function(err, doc){
        HubMessage.find({parentHub: doc})
            .populate('user', 'username email')
            .exec(function(err, docs){
                if(err) {
                    return res.status(404).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                res.status(200).json({
                    message: 'success',
                    obj: docs
                });
            });
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

router.post('/', function(req, res, next){
    User.findOne({username: req.body.writer}, function(err, user){
        if(err){
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if(!user) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        Hub.findOne({title: req.body.parentHub}, function(err, hub){
            if(err){
                return res.status(404).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if(hub) {
                var hubMessage = new HubMessage({
                    content: req.body.content,
                    user: user,
                    parentHub: hub
                })  
                hubMessage.save(function(err, result){                    
                    if(err){
                        return res.status(404).json({
                            title: 'An error occurred',
                            error: err
                        });
                    }                    
                    res.status(201).json({
                        message: 'The message has been saved',
                        obj: result
                    });
                })
            }
        })
    })
})

module.exports = router;