'use strict'
export class AdminReports {
    /*@ngInject*/
    constructor($http){
        'ngInject'

        var ctrl = this;
        this.$http = $http;

        this.$http.get('/api/users/countusersbytype/student')
        .then(function(res){
            ctrl.numOfStudents = res.data
        })

        this.$http.get('/api/users/countusersbytype/volunteer')
        .then(function(res){
            ctrl.numOfVolunteers = res.data
        })

        this.$http.get('/api/classes/')
        .then(function(res){
            ctrl.classes = res.data
        })

    }

    //////////////classes tab//////////////
    // classes(courseID){
    //     var ctrl = this;
    //     this.$http.get('/api/classes/reports/classStudentCount/'+courseID)
    //     .then(function(res){
    //         // ctrl.classStudentCount = res.data
    //         return(res.data)
    //     })
    // }

    aggregate(){
        var ctrl = this;
        var attendance = {}
        var count;


        angular.forEach(ctrl.classes, function(value, key) {

            ctrl.$http.get('/api/classes/reports/attendance/'+value._id)
            .then(function(res){
                attendance[value.name]={
                    data : res.data,
                    absent : "",
                    attended : "",
                    excused : "",
                    attendancePercent: ""
                }
            },function(err){
                console.log("ERR",err);
            }).then(function(){
                
                for(count = 0; count < attendance[value.name].data.length; count++){
                    if(attendance[value.name].data[count].attendance == 'Absent'){
                        attendance[value.name].absent = Number(attendance[value.name].data[count].count)
                    } else if (attendance[value.name].data[count].attendance == 'Attended'){
                        attendance[value.name].attended = Number(attendance[value.name].data[count].count)
                    } else if (attendance[value.name].data[count].attendance == 'Excused'){
                        attendance[value.name].excused = Number(attendance[value.name].data[count].count)
                    } 
                }
                attendance[value.name].attendancePercent = 100 * (attendance[value.name].attended  / (attendance[value.name].absent + attendance[value.name].attended + attendance[value.name].excused))
                
            });
        });
    
        ctrl.attendance =  attendance   
    }
}

export default angular.module('refugeeApp.adminReports', ['refugeeApp.auth', 'ui.router'])
  .component('adminReports', {
      template: require('./index.html'),
      controller: AdminReports,
      controllerAs: 'ctrl'
  })
  .name;
