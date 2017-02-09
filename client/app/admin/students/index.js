'use strict'
export class AdminStudents {
    /*@ngInject*/
    constructor($http){
        'ngInject'

        var ctrl = this;
        this.$http = $http;

        $http.get('/api/users')
        .then(function(res){
            ctrl.students = _.filter(res.data,{type:'student'});
        })
    }

    addStudent(){
        var ctrl = this;
        this.$http.post('/api/students',this.newStudent)
        .then(function(res){
            console.log("RES",res);
            this.students.push(res.data)
        })

        this.newStudent = {
            startTime: new Date(1970,1,1,8,0,0,0),
            endTime: new Date(1970,1,1,9,0,0,0)
        }
    }

    showStudents(stud){
            var ctrl = this;
            //this.$http.get('/api/classes/' + course._id +'/students/showStudents' )
            this.$http.get('/api/classes/showStudents/' + stud._id)
            .then(function(res){
                console.log("RES",res.data);
                ctrl.selectedStudent = res.data
                // this.classes.push(res.data)
                //course.added=true
        })
    }

    removeStudent(course){
        var ctrl = this;
        this.$http.delete('/api/students/'+course._id)
        .then(function(res){
            console.log("RES",res);
            ctrl.students.splice(ctrl.students.indexOf(course),1);
        })
    }
}

export default angular.module('refugeeApp.adminStudents', ['refugeeApp.auth', 'ui.router'])
  .component('adminStudents', {
      template: require('./index.html'),
      controller: AdminStudents,
      controllerAs: 'ctrl'
  })
  .name;
