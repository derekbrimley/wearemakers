'use strict'
import editModal from './editModal.controller.js';
import notesModal from './notesModal.controller.js';
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
    constructor($http, $uibModal){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModal = $uibModal;

        $http.get('/api/volunteers')
        .then(function(res){
            console.log("users:",res);
            ctrl.volunteers = res.data;
            ctrl.pending_volunteers = _.filter(res.data,{status:'pending'});
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
        
        ctrl.orders = ['User.name','User.date','User.organization'];
        ctrl.selected_order = ctrl.orders[0];
        
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
        console.log(ctrl.selectedOrder);
    }

    select(volunteer,saved){
        var ctrl = this;
        volunteer.name = volunteer.User.name;
        volunteer.email = volunteer.User.email;
        volunteer.phone = volunteer.User.phone;
        volunteer.role = volunteer.User.role;
        volunteer.organization = volunteer.User.organization;
        
        ctrl.selectedVolunteerEdit = volunteer;
        
        console.log("vol",ctrl.selectedVolunteerEdit);
        volunteer.saved=saved
        
//        this.$http.get('/api/class/volunteer/' + this.selectedVolunteer._id + '/getClasses')
//        .then(function(res) {
//            console.log("v")  
//        })
    }

    openEditModal(volunteer){
        this.selectedVolunteer = volunteer;
        var modalInstance = this.$uibModal.open({
          template: require('./editModal.html'),
          controller: 'volunteerEditModal',
          bindToController: true,
          controllerAs: 'ctrl',
          resolve: {
             volunteer: () => {
                  return this.selectedVolunteer;
              }
          }
        });
    }

    openNotesModal(volunteer) {
        this.selectedVolunteer = volunteer;
        var modalInstance = this.$uibModal.open({
          template: require('./notesModal.html'),
          controller: 'volunteerNotesModalController',
          bindToController: true,
          controllerAs: 'ctrl',
          resolve: {
             volunteer: () => {
                  return this.selectedVolunteer;
              }
          }
        });
    }

    showClasses(volunteer) {
        var ctrl = this;
        ctrl.selectedVolunteer = volunteer;
        console.log("VOLUNTEER",volunteer);
        ctrl.$http.get('/api/classes/showVolunteers/' + ctrl.selectedVolunteer._id)
        .then(function(res) {
            console.log("volunteerclasses",res);
            ctrl.volunteerclasses = res.data;
        })
    }

    updateVolunteer() {
        this.$http.put('/api/users/' + this.selectedVolunteerEdit.userID + '/upsert',this.selectedVolunteerEdit.User)
        .then(res => {
            console.log("RES User update", res);
        })
        
        this.$http.put('/api/volunteers/'+this.selectedVolunteerEdit._id, this.selectedVolunteerEdit)
        .then(res => {
            console.log("RES Updates", res);
        })
        console.log("VOL",this.selectedVolunteerEdit);
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
        course.status = 'active'
        this.$http.put('/api/classes/' + course._id + '/volunteers/' + this.selectedVolunteer._id, body)
        .then(res => {
            console.log("volunteerclass update",res)
        })
    }

    removeCourse(course) {
        var ctrl = this;
        var body = {
            status: 'pending'
        };
        course.status = 'pending'
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

export default angular.module('refugeeApp.adminVolunteers', ['refugeeApp.auth', 'ui.router', editModal,notesModal])
  .component('adminVolunteers', {
      template: require('./index.html'),
      controller: AdminVolunteers,
      controllerAs: 'ctrl'
  })
  .name;
