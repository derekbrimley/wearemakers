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
            ctrl.volunteers = res.data;
            ctrl.volunteerAttendance();
            ctrl.pending_volunteers = _.filter(res.data,{status:'pending'});
            ctrl.inactive_volunteers = _.filter(res.data,{status:'inactive'});
            ctrl.totalVolunteers = ctrl.volunteers.length;
        })
        
        $http.get('/api/classes')
        .then(function(res){
            ctrl.classes = _.filter(res.data,{active:true});
            ctrl.selected_class = ctrl.classes[0];
        })
        
        ctrl.statuses = ['active','pending','inactive'];
        ctrl.selected_status = ctrl.statuses[0];
        
        ctrl.orders = ['User.name','User.date','User.organization'];
        ctrl.selected_order = ctrl.orders[0];
        
        
        ctrl.currentPage = 1;
        ctrl.itemsPerPage = 10;
        ctrl.itemsPerPageOptions = [10,20,50,100];
        
    }

    setPage(pageNum) {
        var ctrl = this;
        ctrl.currentPage = pageNum;
    }
    
    pageChanged() {
        var ctrl = this;
    }

    filterChanged() {
        var ctrl = this;
        ctrl.selectedVolunteer = null;
    }
    
    volunteerAttendance() {
        var ctrl = this;
        ctrl.volunteersWithAttendance = [];
        
        //ATTENDANCE PERCENTAGE = NUMBER OF SESSIONS ATTENDED / NUMBER OF SESSIONS TOTAL - NUMBER OF EXCUSED SESSIONS
        
        //GET NUMBER OF SESSIONS TOTAL
        angular.forEach(ctrl.volunteers, function(volunteer) {
            
            var volunteer_user_id = volunteer.userID;
            
            ctrl.$http.get('/api/sessions/' + volunteer_user_id + '/getSessionVolunteers')
            .then((res) => {
                //ALL SESSIONS
                var sessions = res.data;
                //GET NUMBER OF SESSIONS ATTENDED
                var attendedSessions = res.data.filter((session) => {
                    return session.attendance == 'Attended' ? true : false; 
                })
                
                //GET NUMBER OF SESSIONS EXCUSED
                var excusedSessions = res.data.filter((session) => {
                    return session.attendance == 'Excused' ? true : false; 
                })
                
                var sessionPercent = 100 * attendedSessions.length / (sessions.length - excusedSessions.length);
                
                ctrl.volunteersWithAttendance.push({
                    name: volunteer.User.name,
                    email: volunteer.User.email,
                    phone: volunteer.User.phone,
                    organization: volunteer.User.organization,
                    status: volunteer.status,
                    percent: isNaN(sessionPercent) ? null : sessionPercent
                });
                
            });
        });
    
    }

    select(volunteer,saved){
        var ctrl = this;
        volunteer.name = volunteer.User.name;
        volunteer.email = volunteer.User.email;
        volunteer.phone = volunteer.User.phone;
        volunteer.role = volunteer.User.role;
        volunteer.organization = volunteer.User.organization;
        
        ctrl.selectedVolunteerEdit = volunteer;
        
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
        ctrl.$http.get('/api/classes/showVolunteers/' + ctrl.selectedVolunteer._id)
        .then(function(res) {
            ctrl.volunteerclasses = res.data;
        })
    }

    updateVolunteer() {
        this.$http.put('/api/users/' + this.selectedVolunteerEdit.userID + '/upsert',this.selectedVolunteerEdit.User)
        .then(res => {
        })
        
        this.$http.put('/api/volunteers/'+this.selectedVolunteerEdit._id, this.selectedVolunteerEdit)
        .then(res => {
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
        course.status = 'active'
        this.$http.put('/api/classes/' + course._id + '/volunteers/' + this.selectedVolunteer._id, body)
        .then(res => {
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
        })
    }

    showApprove(course) {
        console.log("course",course);
        this.$http.get('/api/classes/' + course._id + '/volunteers/' + this.selectedVolunteer._id)
        .then(res => {
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
