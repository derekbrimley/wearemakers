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
import moment from 'moment';
import {
  ClassSession,SessionVolunteer,SessionStudent,User,Class
} from '../../../sqldb';

// Constant that determines how many weeks out the createSession builder should build
const weeksOut = 4;

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

function getClasses(){
        return Class.findAll({where:{active:true}});
}

function checkSessions(){
    return getClasses()
    .then(classes => {
        var promises = [];
        for(var i in classes){
            var course = classes[i];
            promises.push(checkClass(course));
        }
        // return Promise.all(promises)
        // .then(() => {
        //     console.log("ALL COURSES RESOLVED");
        //
        // })
        // .catch((e) => {
        //     console.log("ERR",e);
        //     res.status(500).send(e);
        // });
    })
}

function checkClass(course){
    // For every day in however many weeks are specified, verify there is a session;
    var promises = [];
    for(var i=0; i <= weeksOut * 7; i++){
        var date = moment(0, "HH").add('days',i);
        var endDate = moment(course.endDate);
        if(date.isBefore(endDate)){
            // Check if there is a session, if not create it;
            var p = checkSession(course,date);
        }

        promises.push(p);
    }
    return Promise.all(promises).then(()=>{
        console.log("All sessions created");
    });
}

function checkSession(course,date){
    return ClassSession.find({
        where:{
            date:{
                $gte: date.toDate(),
                $lt: date.add('days',1).toDate()
            },
            classID:course._id
        }
    }).then(entity => {
        if(!entity){
            console.log("CREATING");
            var session = ClassSession.build({classID:course._id,date:date})
            return session.save()
        }
    })
    .catch(err => {
        console.log("ERR",err);
    })
}


// Gets a list of ClassSessions
export function index(req, res) {
    checkSessions()
    .then(() => {
        if(req.user.role =='admin'){
            return ClassSession.findAll({
                include: [Class, SessionVolunteer, SessionStudent]
            })
            .then(respondWithResult(res))
            .catch(handleError(res));
        }
        else{
            return ClassSession.findAll({
                include: [Class],
                where:{
                    date:{
                        $gte:new Date()
                    }
                }
            })
            .then(respondWithResult(res))
            .catch(handleError(res));

        }
    })
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
        },{
            model:SessionStudent,
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

export function getMine(req, res) {
    return SessionVolunteer.findAll({
        where: {
            userID: req.params.user
        },
        include: [
            {
                model:ClassSession,
                include: Class
            }
        ]
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
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
