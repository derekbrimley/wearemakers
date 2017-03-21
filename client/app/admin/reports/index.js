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

    aggregateStudents() {
        var ctrl = this;
        var attendance = {}
        var count;


        angular.forEach(ctrl.classes, function(course, key) {

            ctrl.$http.get('/api/classes/reports/studentAttendance/'+course._id)
            .then(function(res){
                console.log("RES",res.data);
                attendance[course.name]={
                    data : res.data,
                    absent : "",
                    attended : "",
                    excused : "",
                    attendancePercent: ""
                }
            },function(err){
                console.log("ERR",err);
            }).then(function(){
                
                for(count = 0; count < attendance[course.name].data.length; count++){
                    if(attendance[course.name].data[count].attendance == 'Absent'){
                        attendance[course.name].absent = Number(attendance[course.name].data[count].count)
                    } else if (attendance[course.name].data[count].attendance == 'Attended'){
                        attendance[course.name].attended = Number(attendance[course.name].data[count].count)
                    } else if (attendance[course.name].data[count].attendance == 'Excused'){
                        attendance[course.name].excused = Number(attendance[course.name].data[count].count)
                    } 
                }
                attendance[course.name].attendancePercent = (100 * (attendance[course.name].attended  / (attendance[course.name].absent + attendance[course.name].attended + attendance[course.name].excused))).toFixed(2);
                
            });
        });
    
        ctrl.studentAttendance =  attendance;
        console.log("studentAttendance",ctrl.studentAttendance);
    }
    
    aggregateVolunteers() {
        var ctrl = this;
        var attendance = {}
        var count;
        
        angular.forEach(ctrl.classes, function(course, key) {

            ctrl.$http.get('/api/classes/reports/volunteerAttendance/'+course._id)
            .then(function(res){
                console.log("RES",res.data);
                attendance[course.name]={
                    data : res.data,
                    absent : "",
                    attended : "",
                    excused : "",
                    attendancePercent: ""
                }
            },function(err){
                console.log("ERR",err);
            }).then(function(){
                
                for(count = 0; count < attendance[course.name].data.length; count++){
                    if(attendance[course.name].data[count].attendance == 'Absent'){
                        attendance[course.name].absent = Number(attendance[course.name].data[count].count)
                    } else if (attendance[course.name].data[count].attendance == 'Attended'){
                        attendance[course.name].attended = Number(attendance[course.name].data[count].count)
                    } else if (attendance[course.name].data[count].attendance == 'Excused'){
                        attendance[course.name].excused = Number(attendance[course.name].data[count].count)
                    } 
                }
                attendance[course.name].attendancePercent = (100 * (attendance[course.name].attended  / (attendance[course.name].absent + attendance[course.name].attended + attendance[course.name].excused))).toFixed(2);
                
            });
        });
    
        ctrl.volunteerAttendance =  attendance;
        console.log("volunteerAttendance",ctrl.volunteerAttendance);
        
    }
}

export default angular.module('refugeeApp.adminReports', ['refugeeApp.auth', 'ui.router'])
  .component('adminReports', {
      template: require('./index.html'),
      controller: AdminReports,
      controllerAs: 'ctrl'
  })
  .name;
