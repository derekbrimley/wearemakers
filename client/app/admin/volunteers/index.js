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
        
        $http.get('/api/classes')
        .then(function(res){
            console.log("classes:",res);
            ctrl.classes = _.filter(res.data,{active:true});
            ctrl.selected_class = ctrl.classes[0];
        })
        
        ctrl.statuses = ['active','pending','inactive'];
        ctrl.selected_status = ctrl.statuses[0];
        
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

    filterChanged() {
        var ctrl = this;
        ctrl.selectedVolunteer = null;
        console.log("selectedVolunteer", ctrl.selectedVolunteer);
    }

    select(volunteer){
        var ctrl = this;
        volunteer.name = volunteer.User.name;
        volunteer.email = volunteer.User.email;
        volunteer.organization = volunteer.User.organization;
        ctrl.selectedVolunteer = volunteer;
        
        this.$http.get('/api/classes/showVolunteers/' + this.selectedVolunteer._id)
        .then(function(res) {
            console.log("volunteerclasses",res);
            ctrl.volunteerclasses = res.data;
        })
        
//        this.$http.get('/api/class/volunteer/' + this.selectedVolunteer._id + '/getClasses')
//        .then(function(res) {
//            console.log("v")  
//        })
    }

    updateVolunteer() {
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
    
    approveCourse(course) {
        var ctrl = this;
        var body = {
            status: 'active' 
        };
        
        this.$http.put('/api/classes/' + course._id + '/volunteers/' + this.selectedVolunteer._id, body)
        .then(res => {
            console.log("volunteerclass update",res)
        })
    }

    showApprove(course) {
        console.log("course",course);
        this.$http.get('/api/classes/' + course._id + '/volunteers/' + this.selectedVolunteer._id)
        .then(res => {
            console.log("class",res);
            if(res.data.status.active=="pending") {
                return true;
            }
            return false;
        })
    }
    
    addVolunteerToClass() {
        var body = {
            classID: this.selected_class._id,
            userID: this.selectedVolunteer._id,
            active: true,
            status: 'pending'
        }
        
        this.$http.post('/api/classes/' + this.selected_class._id + '/volunteers/', body)
        .then(res => {
            console.log("Added class", res);
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
