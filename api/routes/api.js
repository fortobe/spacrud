const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateRegisterInput = require('../middleware/register');
const validateLoginInput = require('../middleware/login');
const validateEntryInput = require('../middleware/entry');
const IsEmpty = require('../middleware/empty');

const User = require('../models/User');
const Entry = require('../models/Entry');

router.post('/register', function(req, res) {

    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            });

            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                });
                        }
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if(err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                });
        });
});

router.post('/save', function(req, res) {
    const { errors, isValid } = validateEntryInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
    if (!!req.body._id) {
        Entry.updateOne({_id: req.body._id}, {$set: {
                name: req.body.name,
                text: req.body.text
            }}).then(entry => {
            res.json(entry)
        });
    } else {
        const entry = new Entry({
            name: req.body.name,
            text: req.body.text,
            user: req.body.user
        });
        entry
            .save()
            .then(entry => {
                res.json(entry)
            });
    }
});

router.post('/list', function(req, res) {
    const isValid = !IsEmpty(req.body.user);
    if(!isValid) {
        return res.status(400).json({user: 'Server error'});
    }
    Entry.find({user: req.body.user}).then(entries =>
        res.json({
            success: true,
            entries: entries
        })
    );
});

router.post('/get', function(req, res) {
    Entry.findOne({_id: req.body.id}).then(entry =>
        res.json({
            success: true,
            entry: entry
        })
    );
});

router.post('/del', function(req, res) {
    Entry.findOneAndDelete({_id: req.body._id}).then(entry =>
        res.json({success: true})
    )
});

module.exports = router;