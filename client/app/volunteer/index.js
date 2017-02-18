'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './routes';
import _ from 'lodash';

export class VolunteerController {
    
    constructor(Auth, $state, $http) {
        'ngInject';
        var ctrl = this;
        
        this.$http = $http;

        $http.get('/api/classes/mine')
        .then(function(res){
            console.log("my classes",res);
            ctrl.my_sessions = res.data;
        })
        
        $http.get('/api/classes/')
        .then(function(res) {
            console.log('not my classes',res);
            ctrl.classes = res.data;
        })
        
        Auth.getCurrentUser()
        .then(function(res){
            console.log("user",res);
            ctrl.myUser = res;
        });
//        $http.get('/api/users/me')
//        .then(function(res){
//            console.log("me",res);
//            ctrl.my_info = res.data;
//        })

    }
    
    showRequest(course) {
        var ctrl = this;
        var volunteers = [];
        course.ClassVolunteers.forEach(function(res) {
            volunteers.push(res.userID);
        })
        console.log("user id",ctrl.myUser._id);
        console.log("volunteers",volunteers);
        if(volunteers.indexOf(ctrl.myUser._id) > -1) {
            return true;
        }
        return false;
//        if(course.ClassVolunteers.)
    }
    
    request_course(course) {
        var ctrl = this;
        var body = {
            classID: course._id,
            userID: this.myUser._id
        }
        
        this.$http.get('/api/classes/'+course._id+'/volunteers/register', body)
        .then(function(res) {
            console.log("RES Request", res)
            course.added=true
        })
    }

    updateProfile() {
        var ctrl = this;
        console.log("myUser",ctrl.myUser);
        
        this.$http.put('/api/users/' + ctrl.myUser._id + '/upsert',ctrl.myUser)
        .then(res => {
            console.log("RES User update", res);
        })
        
        this.$http.put('/api/volunteers/' + ctrl.myUser._id, ctrl.myUser)
        .then(function(res) {
            console.log("UPDATE",res)
        })
                        
    }
    
}

export default angular.module('refugeeApp.volunteer', [uiRouter])
  .config(routes)
  .component('volunteer', {
    template: require('./index.html'),
    controller: VolunteerController,
    controllerAs: 'ctrl'
  })
  .name;
