'use strict'
export class InfoModalController {
    /*@ngInject*/
    constructor($http,$uibModalInstance){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;

        this.$http.get('/api/classes/getStudentsFromClass/' + this.$resolve.class._id)
        .then(function(res) {
            ctrl.students = res.data;
        })

        var attendance = {}
        var count;
        ctrl.$http.get('/api/classes/reports/studentAttendance/'+this.$resolve.class._id)
        .then(function(res){
            attendance={
                data : res.data,
                absent : "",
                attended : "",
                excused : "",
                attendancePercent: ""
            }
        },function(err){
            console.log("ERR",err);
        })
        .then(function(){
            for(count = 0; count < attendance.data.length; count++){
                if(attendance.data[count].attendance == 'Absent'){
                    attendance.absent = Number(attendance.data[count].count)
                } else if (attendance.data[count].attendance == 'Attended'){
                    attendance.attended = Number(attendance.data[count].count)
                } else if (attendance.data[count].attendance == 'Excused'){
                    attendance.excused = Number(attendance.data[count].count)
                } 
            }
            attendance.attendancePercent = (100 * (attendance.attended  / (attendance.absent + attendance.attended + attendance.excused))).toFixed(2)
            ctrl.attendance = attendance
        });
    }


    close(){
        this.$uibModalInstance.close();
    }

}

export default angular.module('refugeeApp.classInfoModal', ['refugeeApp.auth', 'ui.router'])
  .controller('classInfoModalController', InfoModalController)
  .name;

