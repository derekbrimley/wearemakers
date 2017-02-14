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
import {ClassVolunteer} from '../../../sqldb';
import {Class} from '../../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
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

// Gets a list of ClassVolunteers
export function index(req, res) {
  return ClassVolunteer.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ClassVolunteer from the DB
export function show(req, res) {
  return ClassVolunteer.find({
      where: {
        _id: req.params.id
      },
      include:[{
        model:Class
      }]
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Creates a new ClassVolunteer in the DB
export function create(req, res) {
  return ClassVolunteer.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function register(req, res) {
  return ClassVolunteer.create({
      classID:req.class._id,
      userID:req.user._id,
      active:true,
      status:'pending'
  })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function update(req, res) {
  //TODO:ADD SECURITY CHECK HERE TO MAKE SURE REQUEST IS ADMIN OR CURRENT USER

  if (req.body._id) {
    delete req.body._id;
  }

  return ClassVolunteer.update(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ClassVolunteer from the DB
export function destroy(req, res) {
  return ClassVolunteer.update({
      active: false
    }, {
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(function(entity) {
      res.status(200).send();
    })
    .catch(handleError(res));
}
