/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/sessions              ->  index
 * POST    /api/sessions              ->  create
 * GET     /api/sessions/:id          ->  show
 * PUT     /api/sessions/:id          ->  upsert
 * PATCH   /api/sessions/:id          ->  patch
 * DELETE  /api/sessions/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {
  ClassSession,SessionVolunteer,SessionStudent,User,Class
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

// Gets a list of ClassSessions
export function index(req, res) {
  return ClassSession.findAll({
      include: [Class]
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ClassSession from the DB
export function show(req, res) {
  return ClassSession.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ClassSession in the DB
export function create(req, res) {
    if(!req.body.date){
        res.status(400).json({message:"A date is required"})
        return;
    }
    ClassSession.find({
        where:{date:req.body.date,
            classID:req.body.classID
        },
        include:[{
            model:SessionVolunteer,
            include:[User]
        }]})
    .then(function(entity){
        if(entity){
            res.status(403).json({message:'Session already exists for given date',session:entity})
            return;
        }
        else{
            return ClassSession.create(req.body)
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

  return ClassSession.update(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ClassSession from the DB
export function destroy(req, res) {
  return ClassSession.update({
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
