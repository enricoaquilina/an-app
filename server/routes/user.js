var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');
var token = require('jsonwebtoken');

var User = require('../models/user');

router.post('/create', function(req, res, next){
    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: passwordHash.generate(req.body.password)
    });
    User.findOne({username: user.username}, function(err, doc) {
        if(err){
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if(doc){
            return res.status(403).json({
                title: 'We are sorry!',
                error: {
                    message: 'There already exists a user with the same username!'
                }
            });
        }
        if(!doc){
            user.save(function(err, result){
                if(err){
                    return res.status(404).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                res.status(201).json({
                    message: 'The user has been saved',
                    obj: result
                });
            })
        }
    })
   
})
router.post('/signin', function(req,res,next){
    User.findOne({username: req.body.username})
        .populate({
            path: 'ownedHubs', 
            select: 'title description owner',
            populate: {
                path:'owner',
                select: 'username email firstName lastName'
            }
        })
        .populate({
            path: 'subscribedHubs', 
            select: 'title description owner',
            populate: {
                path:'owner',
                select: 'username email firstName lastName'
            }
        })
        .exec(function(err, doc) {
            if(err){
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: err
                });
            }
            if(!doc) {
                return res.status(503).json({
                    title: 'We are sorry!',
                    error: { message: 'User could not be found' }
                });
            }
            if(!passwordHash.verify(req.body.password, doc.password)){
                return res.status(503).json({
                    title: 'We are sorry!',
                    error: { message: 'The username or password are incorrect!' }
                });
            }
            var token = jwt.sign({user:doc}, 'd8f6b7a3-d98d-4f0a-88a2-ff90e26a6e70', {expiresIn: 7200});
            doc.password = '';

            res.status(200).json({
                message: 'Success!',
                token: token,
                userId: doc._id,
                obj: JSON.stringify(doc)
            })
    })
})
router.use('/', function(req, res, next) {
    if(req.query.token) {
        token.verify(req.query.token, 'd8f6b7a3-d98d-4f0a-88a2-ff90e26a6e70', function(err, decoded){
            if(err){
                return res.status(401).json({
                    title: 'Not authorized',
                    error: err
                });
            }
            next();
        })
    }
})
router.post('/', function(req, res, next){
    var decoded = token.decode(req.query.token);
    User.findOne( { _id: req.body.userId }, 
        function(err, doc) {
            if(err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            if(!doc) {
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: { message: 'The user was not found here :(' }
                });
            }
            if(doc._id != decoded.user._id) {
                return res.status(401).json({
                    title: 'Not authorized',
                    error: { message: 'You are not authorized to access this page!' }
                });
            }
            res.status(200).json({
                message: 'User was found!',
                obj: doc
            })
        }
    )
})
router.get('/', function(req, res, next){
    var decoded = token.decode(req.query.token);
    User.findById(decoded.user._id, 
        function(err,doc) {
            if(err) {
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: err
                });
            }
            if(!doc) {
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: { message: 'The requested used was not found here!' }
                });
            }
            if(!doc.isAdmin){
                return res.status(401).json({
                    title: 'Not authorized',
                    error: { message: 'You are not authorized to access this page!' },
                });
            }
            User.find({ _id : { $ne: doc._id } })
                .exec(function(err, docs) {
                    if(err){
                        return res.status(404).json({
                            title: 'An error occurred',
                            error: err
                        })
                    }
                    res.status(200).json({
                        message: 'success',
                        obj: docs
                    });
                })
        }
    )
})
router.get('/:username', function(req, res, next){
    User.findOne({username: req.params.username}, 
        function(err, doc) {
            if(err) {
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: err
                });
            }
            if(!doc) {
                return res.status(404).json({
                    title: 'The user was not found!',
                    error: err
                });
            }
            res.status(200).json({
                message: 'User was found!',
                obj: doc
            })
        })
})
router.patch('/:id', function(req, res, next){
    var decoded = token.decode(req.query.token);
    User.findOne({username: req.body._id})
        .populate({
            path: 'ownedHubs', 
            select: 'title description owner',
            populate: {
                path:'owner',
                select: 'username email firstName lastName'
            }
        })
        .populate({
            path: 'subscribedHubs', 
            select: 'title description owner',
            populate: {
                path:'owner',
                select: 'username email firstName lastName'
            }
        })
        .exec(function(err, doc){
            if(err) {
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: err
                });
            }
            if(doc) {      
                if(decoded.user._id != doc._id && !decoded.user.isAdmin) {
                    return res.status(401).json({
                        title: 'Not authorized',
                        error: { message: 'You are not authorized to access this page!' },
                    });
                }
            doc.username = req.body.username;
            doc.email = req.body.email;
            doc.firstName = req.body.firstName;
            doc.lastName = req.body.lastName;
            doc.isAdmin = req.body.isAdmin;
            doc.save(function(err, doc) {
                if(err) {
                    return res.status(404).json({
                        title: 'We are sorry!',
                        error: err
                    });
                }
                res.status(200).json({
                    message: 'User saved successfully',
                    obj: doc
                })
            })
        }
        if(!doc) {
            User.findById(req.params.id, function(err, doc) {
                if(err) {
                    return res.status(404).json({
                        title: 'We are sorry!',
                        error: err
                    });
                }
                if(!doc) {
                    return res.status(404).json({
                        title: 'The user was not found!',
                        error: err
                    });
                }
                if(decoded.user._id != doc._id && !decoded.user.isAdmin){
                    return res.status(401).json({
                        title: 'Not authorized',
                        error: { message: 'You are not authorized to access this page!' }
                    });
                }
                doc.username = req.body.username;
                doc.email = req.body.email;
                doc.firstName = req.body.firstName;
                doc.lastName = req.body.lastName;
                doc.isAdmin = req.body.isAdmin;
                doc.save(function(err, doc){
                    if(err) {
                        //TODO appropriate error handling
                        if(err.message == 'User validation failed') {
                            return res.status(404).json({
                                title: 'We are sorry!',
                                error: {message:'There already is a user with the same details!'}
                            });
                        }
                        return res.status(404).json({
                            title: 'We are sorry!',
                            error: err
                        });
                    }
                    res.status(200).json({
                        message: 'User saved successfully',
                        obj: doc
                    })
                })
            })
        }
    })
})
router.delete('/:username', function(req, res, next){
    var decoded = token.decode(req.query.token);
    User.findOne({username: req.params.username}, function(err, doc){
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
        if(decoded.user._id != doc._id && !decoded.user.isAdmin){
            return res.status(401).json({
                title: 'We are sorry!',
                error: err
            });
        }
        doc.remove(function(err, doc){
            if(err) {
                return res.status(404).json({
                    title: 'We are sorry!',
                    error: err
                })
            }
            res.status(200).json({
                title: 'User has been deleted!'
            })
        });
    });
})
module.exports = router;