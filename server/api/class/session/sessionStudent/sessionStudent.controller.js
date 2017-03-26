'use strict';

import jsonpatch from 'fast-json-patch';
import _ from 'lodash';
import {
  SessionStudent,User,ClassStudent,ClassSession
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

// Gets a list of SessionStudent
export function index(req, res) {
  return SessionStudent.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single SessionStudent from the DB
export function show(req, res) {
  return SessionStudent.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new SessionStudent in the DB
export function create(req, res) {
    req.body.sessionID = req.classSession._id;
    if(_.find(req.classSession.SessionStudent,{userID:req.body.userID})){
        res.status(403).json({message:'Student is already registered for this course'})
        return;
    }

  return SessionStudent.create(req.body,{include:[User]})
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}


export function register(req, res) {

  SessionStudent.find({
    where:{sessionID:req.classSession._id,
          userID:req.body.userID
  }})
  .then(function(entity){
    if(entity){
            res.status(403).json({message:'Student Session Already exists'})
            return;
        }
        else{
            return SessionStudent.create({sessionID:req.classSession._id, userID:req.body.userID,attendance:req.body.attendance})
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

  return SessionStudent.update(req.body, {
      where: {
        _id: req.params.id
      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a SessionStudent from the DB
export function destroy(req, res) {
  return SessionStudent.destroy({
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


// get count of students by class
export function individualStudentAttendance(req, res) {
 return SessionStudent.count({
   attributes: ['attendance'],
   group: ['attendance'],
   where:{userID:req.body.studentid}
   ,
   include:[{
          model:ClassSession,
          attributes: ['classID'],
          where:{classID:req.body.classid}
      }]
 }).then(function(c) {
    res.json(c);
    console.log(c)
  })
}
