'use strict'
export class AdminVolunteers {
    newVolunteer = {
        name: '',
        email: '',
        role: 'user',
        type: 'volunteer',
        organization: '',
        status: '',
        password: ''
    }
    /*@ngInject*/
    constructor($http){
        'ngInject'

        var ctrl = this;
        this.$http = $http;

        $http.get('/api/volunteers')
        .then(function(res){
            console.log("users:",res);
            ctrl.volunteers = res.data;
        })
        
        $http.get('/api/volunteers')
        .then(function(res){
            console.log("users:",res);
            ctrl.pending_volunteers = _.filter(res.data,{status:'pending'});
        })
        
        $http.get('/api/volunteers')
        .then(function(res){
            console.log("users:",res);
            ctrl.inactive_volunteers = _.filter(res.data,{status:'inactive'});
        })
        
        ctrl.statuses = ['active','pending','inactive'];
        ctrl.selected = ctrl.statuses[0];
        
    }
//
//    addVolunteer(){
//        var ctrl = this;
//        this.$http.post('/api/volunteer',this.newVolunteer)
//        .then(function(res){
//            this.volunteers.push(res.data)
//        })
//
//        this.newVolunteer = {
//            name: '',
//            email: '',
//            role: 'user',
//            type: 'volunteer',
//            organization: '',
//            password: ''
//        }
//    }

    select(volunteer){
        var ctrl = this;
        volunteer.name = volunteer.User.name;
        volunteer.email = volunteer.User.email;
        volunteer.organization = volunteer.User.organization;
        ctrl.selectedVolunteer = volunteer;
        
//        this.$http.get('/api/classes/volunteer/' + this.selectedVolunteer._id + '/getClasses')
//        .then(function(res) {
//            console.log("volunteerclasses",res);
//            ctrl.volunteerclasses = res.data;
//        })
    }

    updateVolunteer() {
        console.log("USER ID", this.selectedVolunteer.userID);
        this.$http.put('/api/users/' + this.selectedVolunteer.userID + '/upsert',this.selectedVolunteer)
        .then(res => {
            console.log("RES User update", res);
        })
        
        this.$http.put('/api/volunteers/'+this.selectedVolunteer._id, this.selectedVolunteer)
        .then(res => {
            console.log("RES Updates", res);
        })
    }

    removeVolunteer(volunteer){
        var ctrl = this;
        this.$http.delete('/api/volunteers/'+volunteer._id)
        .then(function(res){
//            console.log("RES",res);
            ctrl.volunteers.splice(ctrl.volunteers.indexOf(volunteer),1);
        })
    }
    
    addVolunteerToClass(course) {
        this.$http.post('/api/classes/' + course.id + '/volunteers')
    }
}

export default angular.module('refugeeApp.adminVolunteers', ['refugeeApp.auth', 'ui.router'])
  .component('adminVolunteers', {
      template: require('./index.html'),
      controller: AdminVolunteers,
      controllerAs: 'ctrl'
  })
  .name;
