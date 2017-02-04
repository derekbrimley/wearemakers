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

        $http.get('/api/classes/{classid}/mine')
        .then(function(res){
            console.log("classes",res);
            ctrl.my_classes = res.data;
        })
        
        $http.get('/api/classes')
        .then(function(res) {
            console.log('classes',res);
            ctrl.classes = res.data;
        })

    }
    
    register_for_class(id) {
        var ctrl = this;
        this.$http.post('/api/class/volunteer')
        .then(function(res){
            console.log("RES",res);
            this.my_classes.push(res.data);
        })
        
        
        this.$http.post('/api/classes',this.newClass)
        .then(function(res){
            console.log("RES",res);
            this.classes.push(res.data)
        })

        this.newVolunteerClass = {
            classID: 0,
            userID: 0
        }
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
