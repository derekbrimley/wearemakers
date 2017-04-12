/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/volunteers              ->  index
 * POST    /api/volunteers              ->  create
 * GET     /api/volunteers/:id          ->  show
 * PUT     /api/volunteers/:id          ->  upsert
 * PATCH   /api/volunteers/:id          ->  patch
 * DELETE  /api/volunteers/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Volunteer,User} from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Volunteers
export function index(req, res) {
  return Volunteer.findAll({
      include:[User]
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Volunteer from the DB
export function show(req, res) {
  return Volunteer.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getByUserId(req, res) {
  return Volunteer.find({
    where: {
      userID: req.params.id
    },
    include: [User]
  })
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

export function getClasses(req, res) {
    return ClassVolunteer.findAll({
        where: {
            userID: req.params.id
        }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Volunteer in the DB
export function create(req, res) {
    if(req.user.role != 'admin'){
        req.body.userID = req.user._id;
    }
  return Volunteer.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Volunteer in the DB
export function update(req, res) {
  if(req.body.userID) {
    delete req.body.userID;
  }
  if(req.body._id) {
    delete req.body._id;
  }
  if(req.user.role == 'admin'){
      return Volunteer.update(
          req.body,
          {
              where: {
                  _id: req.params.id
              }
          })
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  else{
      return Volunteer.update(
          req.body,
          {
              where: {
              _id: req.params.id,
              userID: req.user._id
          }
      })
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
}

// Deletes a Volunteer from the DB
export function destroy(req, res) {
  return Volunteer.update({
    where: {
      _id: req.params.id
    }
},{active:false})
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
