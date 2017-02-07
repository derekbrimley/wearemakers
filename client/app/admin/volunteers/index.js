'use strict'
export class AdminVolunteers {
    newVolunteer = {
        name: '',
        email: '',
        role: 'user',
        type: 'volunteer',
        organization: '',
        password: ''
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
            name: '',
            email: '',
            role: 'user',
            type: 'volunteer',
            organization: '',
            password: ''
        }
    }

    select(volunteer){
        var ctrl = this;
        volunteer.name = volunteer.name;
        volunteer.email = volunteer.email;
        volunteer.organization = volunteer.organization;
        ctrl.selectedVolunteer = volunteer;
    }

    removeVolunteer(volunteer){
        var ctrl = this;
        this.$http.delete('/api/volunteers/'+volunteer._id)
        .then(function(res){
//            console.log("RES",res);
            ctrl.volunteers.splice(ctrl.volunteers.indexOf(volunteer),1);
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
