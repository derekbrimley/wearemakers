'use strict'
export class EditVolunteerController {
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
        
        volunteer.User = {
            name: volunteer.name,
            email: volunteer.email,
            phone: volunteer.phone,
            organization: volunteer.organization,
            status: volunteer.status,
            notes: volunteer.notes,
        }
      
        this.$http.put('/api/users/' + volunteer.userID + '/upsert',volunteer.User)
        .then(res => {
        })
    
        this.$http.put('/api/volunteers/'+volunteer._id,volunteer)
        .then(res =>{
            this.$uibModalInstance.close();
        })
        
    }

}

export default angular.module('refugeeApp.volunteerEditModal', ['refugeeApp.auth', 'ui.router'])
  .controller('volunteerEditModal', EditVolunteerController)
  .name;

