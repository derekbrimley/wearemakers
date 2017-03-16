/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/classes              ->  index
 * POST    /api/classes              ->  create
 * GET     /api/classes/:id          ->  show
 * PUT     /api/classes/:id          ->  upsert
 * PATCH   /api/classes/:id          ->  patch
 * DELETE  /api/classes/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {Class} from '../../sqldb';
import {ClassStudent} from '../../sqldb';
import {ClassVolunteer} from '../../sqldb';
import {User} from '../../sqldb';

//for Reporting
import {SessionStudent} from '../../sqldb';
import {ClassSession} from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
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
      console.log("ERROR",err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Classs
export function index(req, res) {
  return Class.findAll({
      where:{active:true},
      include:[{
          model:ClassStudent,
          include:[User]
      },{
          model:ClassVolunteer,
          include:[User]
      }]
        })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Classs
export function showMine(req, res) {
    var type = req.user.type
    if(type == 'student'){
        return ClassStudent.findAll({
            where:{active:true,userID:req.user._id},
            include:[Class]
        })
        .then(respondWithResult(res))
        .catch(handleError(res));
    }

  return ClassVolunteer.findAll({
      where:{active:true,userID:req.user._id},
      include:[Class]
        })
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Gets a single Class from the DB
export function show(req, res) {
  return Class.find({
    where: {
      _id: req.params.id
    },
    include:[{
        model:ClassStudent,
        include:[{
            model:User,
            attributes:['name','email','primaryLanguage']
        }]
    },
    {
        model:ClassVolunteer,
        include:[{
            model:User,
            attributes:['name','email','organization']
        }]
    }]

  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//shows all students for a given course.
export function showStudents(req, res) {
  return ClassStudent.findAll({
      where: {
        userID: req.params.id 
      },
      include:[
          {model:User},
          {model:Class}
      ]
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//shows all students for a given course.
export function getStudentsFromClass(req, res) {
  return ClassStudent.findAll({
      where: {
        classID: req.params.id 
      },
      include:[
          {model:User},
          {model:Class}
      ]
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//shows all volunteers for a given course.
export function showVolunteers(req, res) {
  return ClassVolunteer.findAll({
      where: {
        userID: req.params.id 
      },
      include:[{
        model:Class
      }]
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Creates a new Class in the DB
export function create(req, res) {
  return Class.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates class in the DB
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }

  return Class.update(req.body, {
    where: {
      _id: req.params.id,
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Class from the DB
export function destroy(req, res) {
    return Class.update({active:false},{
      where: {
        _id: req.params.id
      }
    })
      .then(handleEntityNotFound(res))
      .then(function(entity){
          res.status(200).send();
      })
      .catch(handleError(res));
}

//Reporting

// get count of students by class
export function classStudentCount(req, res) {
 
 return ClassStudent.count({
  //  attributes: ['Class.name','Class._id'],
   where:{classID:req.params.classid},
   include:[{
          model:Class
      }]
 }).then(function(c) {
    res.json(c);
  })
}

// get count of students by class
export function attendance(req, res) {
 
 return SessionStudent.count({
   attributes: ['ClassSession.classID','attendance'],
   group: ['ClassSession.classID','attendance'],
   include:[{
          model:ClassSession,
          attributes: ['classID'],
          where:{classID:req.params.classid}
      }]
 }).then(function(c) {
    res.json(c);
  })
}

// export function test(req, res) {
 
//  return SessionStudent.count({
//    attributes: ['ClassSession.classID','attendance'],
//    group: ['ClassSession.classID','attendance'],
//    include:[{
//           model:ClassSession
//       }]
//  }).then(function(c) {
//     res.json(c);
//   })
// }