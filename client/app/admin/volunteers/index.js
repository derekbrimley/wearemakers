'use strict'
export class AdminVolunteers {
    newVolunteer = {
        startTime: new Date(1970,1,1,8,0,0,0),
        endTime: new Date(1970,1,1,9,0,0,0)
    }
    /*@ngInject*/
    constructor($http){
        'ngInject'

        var ctrl = this;
        this.$http = $http;

        $http.get('/api/users')
        .then(function(res){
            ctrl.volunteers = _.filter(res.data,{type:'volunteer'});
        })
    }

    addVolunteer(){
        var ctrl = this;
        this.$http.post('/api/volunteers',this.newVolunteer)
        .then(function(res){
            this.volunteers.push(res.data)
        })

        this.newVolunteer = {
            startTime: new Date(1970,1,1,8,0,0,0),
            endTime: new Date(1970,1,1,9,0,0,0)
        }
    }

    removeVolunteer(course){
        var ctrl = this;
        this.$http.delete('/api/volunteers/'+course._id)
        .then(function(res){
            console.log("RES",res);
            ctrl.volunteers.splice(ctrl.volunteers.indexOf(course),1);
        })
    }
}

export default angular.module('refugeeApp.adminVolunteers', ['refugeeApp.auth', 'ui.router'])
  .component('adminVolunteers', {
      template: require('./index.html'),
      controller: AdminVolunteers,
      controllerAs: 'ctrl'
  })
  .name;
