'use strict';

const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './routes';
import _ from 'lodash';

export class VolunteerController {
    
    newVolunteerClass = {
        classID: 0,
        userID: 0
    }
    
    constructor(Auth, $state, $http) {
        'ngInject';
        var ctrl = this;
        
        this.$http = $http;

        $http.get('/api/classes/mine')
        .then(function(res){
            console.log("my classes",res);
            ctrl.my_classes = res.data;
        })
        
        $http.get('/api/classes')
        .then(function(res) {
            console.log('classes',res);
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
    
    request_course(course) {
        var ctrl = this;
        var body = {
            classID: course._id,
            userID: this.myUser._id
        }

        this.$http.get('/api/classes/'+course._id+'/volunteers/register', body)
        .then(function(res) {
            console.log("RES Request", res)
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
