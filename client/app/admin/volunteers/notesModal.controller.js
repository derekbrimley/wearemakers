'use strict'
export class VolunteerNotesController {
    /*@ngInject*/
    constructor($http,$uibModalInstance){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;

        ctrl.statuses = ['active','pending','inactive'];
        ctrl.selected_status = ctrl.statuses[0];
        
    }

    close(){
        this.$uibModalInstance.close();
    }

    updateVolunteer(volunteer){
        var ctrl = this;

        this.$http.put('/api/users/' + volunteer.userID + '/upsert',volunteer.User)
        .then(res => {
        })
    
        this.$http.put('/api/volunteers/'+volunteer._id,volunteer)
        .then(res =>{
            this.$uibModalInstance.close();
        })
        
    }

}

export default angular.module('refugeeApp.volunteerNotesModal', ['refugeeApp.auth', 'ui.router'])
  .controller('volunteerNotesModalController', VolunteerNotesController)
  .name;

