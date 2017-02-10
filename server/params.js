import sqldb from './sqldb';

export default function(app) {
    app.param('class',function(req,res,next,id){
         sqldb.Class.findOne({where:{_id: id}})
         .then(function(entity){
             req.class = entity
             return next();
         })
         .catch(function(err){
             console.log("ERR",err);
         })
    })

    app.param('session',function(req,res,next,id){
         sqldb.ClassSession.findOne({
             where:{_id: id},
             include:[sqldb.Class,sqldb.SessionVolunteer]
         })
         .then(function(entity){
             req.classSession = entity
             return next();
         })
         .catch(function(err){
             console.log("ERR",err);
         })
    })
}
