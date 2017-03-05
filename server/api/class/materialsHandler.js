
'use strict';

import {Class,User} from '../../sqldb';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import {aws} from '../../config/environment'
import _ from 'lodash';
AWS.config.update(aws);
var s3 = new AWS.S3();

var bucketName = "wearemakerstestmaterials"
if(process.env.NODE_ENV == "production"){
    bucketName = "wearemakersmaterials"
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
      console.log(err);
    res.status(statusCode).send(err);
  };
}

export function uploadMaterial(req, result) {
    var key = `${req.class._id}/${req.files.file.filename}`;

    fs.readFile(req.files.file.file, function (err,data) {
      if (err) {
        return result.status(500).send(err);
      }
      var params = {
        Bucket: bucketName,
        Key: key,
        Body: data
      };

      s3.putObject(params, function (err, res) {
          if (err) {
            console.log("Error uploading data: ", err);
            result.status(500).send(err);
          } else {
              result.status(200).send();
          }
        });
    });
}

export function list(req,result){
    var params = {
     Bucket: bucketName,
     Prefix: `${req.class._id}/`
    }

    s3.listObjects(params, function (err, data) {
         if(err){
             result.status(500).send(err);
         }
         var body = {
             files: []
         }
        //  _.forEach(data.Contents,file => body.files.push(file.Key.replace(params.Prefix,'')))
        for(var i in data.Contents){
            var file = data.Contents[i];
            file = file.Key.replace(params.Prefix,'');
            console.log("FILE",file);
            body.files.push(file)
        }
         result.status(200).json(body);
    });
}

export function download(req,result){
    var options = {
        Bucket    : bucketName,
        Key    : `${req.course._id}/${decodeURI(req.params.filename)}`
    };
    console.log(options.Key);
    result.attachment(options.Key);
    var fileStream = s3.getObject(options).createReadStream().on('error',function(err){
        console.log("AWS ERR",err);
        return result.status(500).send(err)})
    fileStream.pipe(result);

}

export function remove(req,result){
    var options = {
        Bucket    : bucketName,
        Delete: {
            Objects:[{Key    : `${req.course._id}/${decodeURI(req.params.filename)}`}]
        }
    };
    s3.deleteObjects(options, function(err, data) {
        if(err){
            return result.status(500).send(err);
        }
        else{
            return result.status(200).send();
        }
    });
}
