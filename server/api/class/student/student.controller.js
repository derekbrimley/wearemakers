/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/students              ->  index
 * POST    /api/students              ->  create
 * GET     /api/students/:id          ->  show
 * PUT     /api/students/:id          ->  upsert
 * PATCH   /api/students/:id          ->  patch
 * DELETE  /api/students/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {
  ClassStudent
} from '../../../sqldb';

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

// Gets a list of ClassStudents
export function index(req, res) {
  return ClassStudent.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ClassStudent from the DB
export function show(req, res) {
  return ClassStudent.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ClassStudent in the DB
export function create(req, res) {
  return ClassStudent.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Creates a new ClassStudent in the DB
export function register(req, res) {

    ClassStudent.find({
        where:{userID:req.user._id,
            classID:req.class._id
        }})
    .then(function(entity){
        if(entity){
            res.status(403).json({message:'Already Registered'})
            return;
        }
        else{
          return ClassStudent.create({classID:req.class._id, userID:req.user._id,status:'pending'})
            .then(respondWithResult(res, 201))
            .catch(handleError(res));
        }
    })
}

// Creates a new ClassStudent in the DB, to be used by admin
export function registerforadmin(req, res) {

    ClassStudent.find({
        where:{userID:req.body.userID,
            classID:req.class._id
        }})
    .then(function(entity){
        if(entity){
            res.status(403).json({message:'Already Registered'})
            return;
        }
        else{
          return ClassStudent.create({classID:req.class._id, userID:req.body.userID,status:'Active'})
            .then(respondWithResult(res, 201))
            .catch(handleError(res));
        }
    })
}

export function update(req, res) {
  //TODO:ADD SECURITY CHECK HERE TO MAKE SURE REQUEST IS ADMIN OR CURRENT USER

  if (req.body._id) {
    delete req.body._id;
  }

  return ClassStudent.update(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ClassStudent from the DB
export function destroy(req, res) {
  return ClassStudent.update({
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
