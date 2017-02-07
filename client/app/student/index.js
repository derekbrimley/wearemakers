'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './routes';

export class StudentController {

  constructor(Auth,$http) {
        'ngInject'

        var ctrl = this;
        this.$http = $http;

        $http.get('/api/classes/mine')
        .then(function(res){
            console.log("my classes",res);
            ctrl.my_classes = res.data;
        })

        $http.get('/api/classes')
        .then(function(res){
            console.log("classes",res);
            ctrl.classes = res.data;
        })

        Auth.getCurrentUser()
        .then(function(res){
            console.log("user",res);
            ctrl.myUser = res;
        });
    }

    registerStudent(course){
        var ctrl = this;
        this.$http.get('/api/classes/' + course._id +'/students/register' )
        .then(function(res){
            console.log("RES",res);
            // this.classes.push(res.data)
            course.added=true
        })

        // this.newClass = {
        //     startTime: new Date(1970,1,1,8,0,0,0),
        //     endTime: new Date(1970,1,1,9,0,0,0)
        // }
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
