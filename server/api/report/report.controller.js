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
import {Volunteer,Student,User,SessionStudent,SessionVolunteer,ClassSession,Class} from '../../sqldb';
import csv from 'express-csv';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function volunteers(req, res) {
    SessionVolunteer.findAll({
        include:[User,{
            model:ClassSession,
            include:[Class]
        }
        ]
    })
    .then(entities=>{
        var volunteers = [{
            "Volunteer Name":"Volunteer Name",
            "Organization":"Organization",
            "Class Name": "Class Name",
            "Attendance":"Attendance",
            "Date":"Date"
        }];
        for(var i in entities){
            var volunteer = entities[i];
            volunteers.push({
                "Volunteer Name":volunteer.User.name,
                "Organization":volunteer.User.organization,
                "Class Name": volunteer.ClassSession.Class.name,
                "Attendance":volunteer.attendance,
                "Date":volunteer.ClassSession.date
            })
        }
        res.setHeader('Content-disposition', 'attachment; filename=volunteers.csv')
        return res.csv(volunteers);
    })
    .catch(err=>{
        console.log("ERR",err);
        res.status(500).send(err)
    })
}

export function students(req, res) {
    var attrs = {
        exclude:['_id','active','createdAt','updatedAt']
    }
    SessionStudent.findAll({
        include:[User,{
            model:ClassSession,
            include:[Class]
        }
        ]
    })
    .then(entities=>{
        var students = [{
            "Student Name":"Student Name",
            "Class Name": "Class Name",
            "Attendance":"Attendance",
            "Date":"Date"
        }];
        for(var i in entities){
            var student = entities[i];
            students.push({
                "Student Name":student.User.name,
                "Class Name": student.ClassSession.Class.name,
                "Attendance":student.attendance,
                "Date":student.ClassSession.date
            })
        }
        res.setHeader('Content-disposition', 'attachment; filename=students.csv')
        return res.csv(students);
    })
    .catch(err=>{
        console.log("ERR",err);
        res.status(500).send(err)
    })
}
