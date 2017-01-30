import sqldb from './sqldb';

export default function(app) {
    app.param('class',function(req,res,next,id){
        // try to get the user details from the User model and attach it to the request object
         sqldb.Class.findOne({where:{_id: id}})
         .then(function(entity){
             req.class = entity
             return next();
         })
         .catch(function(err){
             console.log("ERR",err);
         })
    })
}
