'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './routes';

export class StudentController {

  constructor(Auth,$http) {
        'ngInject'

        var ctrl = this;
        this.$http = $http;

        $http.get('/api/classes')
        .then(function(res){
            ctrl.classes = res.data;
        })

        Auth.getCurrentUser()
        .then(function(res){
            ctrl.myUser = res;
            $http.get('/api/classes/' + ctrl.myUser._id + '/mine')
            .then(function(res){
                ctrl.my_classes = res.data;
            })
        });

    }

    myclasses(){
        var ctrl = this;
        this.$http.get('/api/classes/' + ctrl.myUser._id + '/mine')
        .then(function(res){
            ctrl.my_classes = res.data;
        })
    }

    registerStudent(course){
        var ctrl = this;

        this.$http.get('/api/classes/' + course._id +'/students/register' )
        .then(function(res){
            course.added=true

        })
    }

    showRequest(course) {
       var ctrl = this;
       var students = [];
       course.ClassStudents.forEach(function(res) {
           students.push(res.userID);
       })
       if(students.indexOf(ctrl.myUser._id) > -1) {
           return false;
       }
       return true;
   }

    updateProfile() {
        var ctrl = this;

        this.$http.put('/api/users/me' ,ctrl.myUser)
        .then(res => {
        })

        this.$http.put('/api/students/' + ctrl.myUser._id, ctrl.myUser)
        .then(function(res) {
        })

    }

}

export default angular.module('refugeeApp.student', [uiRouter])
  .config(routes)
  .component('student', {
    template: require('./index.html'),
    controller: StudentController,
    controllerAs: 'ctrl'
  })
  .name;
