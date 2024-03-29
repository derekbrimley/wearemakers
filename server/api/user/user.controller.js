'use strict';

import {User, Volunteer} from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.findAll({
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'provider',
      'community',
      'gender',
      'grade',
      'phone',
      'type',
      'organization',
      'primaryLanguage',
      'createdAt'
    ]
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  var newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'user');
  return newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });

      if(newUser.type == 'volunteer'){
          Volunteer.build({userID:user._id,status:'pending'}).save();
      }

    })
    .catch(validationError(res));
}


/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}


// Updates user in the DB
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  var opts = {
    _id: req.user._id
  };
  if(req.user.role == 'admin'){
      opts._id = req.params.userID
  }
  return User.update(req.body, {
    where:opts
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.destroy({ where: { _id: req.params.id } })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.find({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'provider',
      'community',
      'gender',
      'grade',
      'phone',
      'type',
      'organization',
      'primaryLanguage',
      'createdAt'
    ]
  })
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}

/**
 * Promote a user to admin
 */
export function promote(req, res) {
    return User.update({role:'admin'},{
      where: {
        _id: req.params.id
      }
    })
    .then(function(user){
        res.status(200).send();
    })
    .catch(handleError(res));
}

/**
 * Revoke a users admin privileges
 */
export function revoke(req, res) {
    return User.update({role:'user'},{
      where: {
        _id: req.params.id
      }
    })
    .then(function(user){
        res.status(200).send();
    })
    .catch(handleError(res));
}


// gets a total count of how many users there are.
export function countallusers(req, res, next) {

 return User.count().then(function(c) {
  console.log("There are " + c + " users!")
    res.json(c);
  })

}

// gets a count of userse by type
export function countusersbytype(req, res, next) {

 return User.count({ where: ["type = ?", req.params.type] }).then(function(c) {
  console.log("There are " + c + " useres of type " + req.params.type)
    res.json(c);
  })
}
