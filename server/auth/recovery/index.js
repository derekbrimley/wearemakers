'use strict';

import express from 'express';
import {User} from '../../sqldb';
import {RecoveryToken} from '../../sqldb';
import moment from 'moment'
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import {signToken} from '../auth.service'
import nodemailer from 'nodemailer'
var router = express.Router();

// router.get('/:token', function(req, res, next) {
//     RecoveryToken.findOne({
//         where:{token:req.params.token}
//     })
//     .then(function(token){
//         if(token && !token.isExpired() && token.valid){
//             token.valid = false;
//             token.save();
//             var authToken = signToken(token.userId,'user')
//             res.status(200).json({token:authToken});
//
//         }
//         else{
//             res.status(400).json({'message':'Invalid token'})
//         }
//     })
//     .catch(function(err){
//         console.log("ERR",err);
//         res.status(500).send();
//     })
// });

//used for validating a token, returns a boolean
router.get('/:token/validate', function(req, res, next) {
    RecoveryToken.findOne({
        where:{token:req.params.token}
    })
    .then(function(token){
        res.status(200).json({valid:token && !token.isExpired() && token.valid})
    })
    .catch(function(err){
        console.log("ERR",err);
    })
});

// Create token in database and send email
router.post('/', function(req, res, next) {
    var email = req.body.email;
    User.findOne({
        where:{email:req.body.email}
    })
    .then(function(entity){
        var userId = entity._id;
        var salt = entity.salt;
        var token = {
            UserId: userId,
            expirationDate:moment().add(1, 'days').utc(),
            valid:true
        }

        // New token is built just to access instance method
        var newToken = RecoveryToken.build(token)
        var tokenString = newToken.encryptToken(email+moment().toString(),salt)
        tokenString = tokenString.replace(/\=/g, '');
        tokenString = tokenString.replace(/\+/g, '');
        tokenString = tokenString.replace(/\?/g, '');
        tokenString = tokenString.replace(/\%/g, '');
        tokenString = tokenString.replace(/\%/g, '');
        //Strip slashes
        newToken.token = tokenString.replace(/\//g, '');

        // Find token, if exists, update it else create a new one
        RecoveryToken.findOne({
            where: {UserId: userId}
        })
        .then(function(token){
            if(token){
                token.expirationDate = moment().add(1, 'days').utc();
                token.valid = true;
                token.token = newToken.token;
                token.save();
            }
            else{
                newToken.save();
            }
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '', /
                    pass: 'testpassword'
                }
            });
            var mailOptions = {
                from: 'Slade Research', // sender address
                to: req.body.email, // list of receivers
                subject: 'Password Reset', // Subject line
                html: 'Follow this link to reset your password <a href="http://www.SITENAMEGOESHERE!!!!.com/login/recovery/update?token='+newToken.token+'">http://www.SITENAMEGOESHERE!!!!.com/login/recovery/update?token='+newToken.token+'</a>' // You can choose to send an HTML body instead
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    res.status(500).send();
                }else{
                    console.log('Message sent: ' + info.response);
                    res.status(200).send();
                };
            });

        })
    })
    .catch(function(err){
        res.status(200).send();
    })

});

// Create token in database and send email
router.post('/:token', function(req, res, next) {
    console.log(req.params.token);
    RecoveryToken.findOne({
        where:{token:req.params.token}
    })
    .then(function(token){
        console.log("TOKEN",token);
        if(token && !token.isExpired() && token.valid){
            token.valid = false;
            User.findOne({
                where:{_id:token.UserId}
            })
            .then(user => {
                user.password = req.body.password;
                return user.save()
                  .then(() => {
                    res.status(204).end();
                })
            })
        }
    })
    .catch(function(err){
        console.log("ERR",err);
        res.status(500).end()
    })
});

export default router;
