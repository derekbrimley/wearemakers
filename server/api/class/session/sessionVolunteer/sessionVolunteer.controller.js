'use strict';

import jsonpatch from 'fast-json-patch';
import {
  SessionVolunteer
} from '../../../../sqldb';

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

// Gets a list of SessionVolunteers
export function index(req, res) {
  return SessionVolunteer.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single SessionVolunteer from the DB
export function show(req, res) {
  return SessionVolunteer.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new SessionVolunteer in the DB
export function create(req, res) {
  return SessionVolunteer.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Creates a new SessionVolunteer in the DB
export function register(req, res) {
  return SessionVolunteer.create({classID:req.class._id, userID:req.user._id})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function update(req, res) {
  //TODO:ADD SECURITY CHECK HERE TO MAKE SURE REQUEST IS ADMIN OR CURRENT USER

  if (req.body._id) {
    delete req.body._id;
  }

  return SessionVolunteer.update(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a SessionVolunteer from the DB
export function destroy(req, res) {
  return SessionVolunteer.update({
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
