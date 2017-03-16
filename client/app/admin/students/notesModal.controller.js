'use strict'
export class StudentNotesController {
    /*@ngInject*/
    constructor($http,$uibModalInstance){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;

        console.log(this.$resolve);
        
        ctrl.statuses = ['active','pending','inactive'];
        ctrl.selected_status = ctrl.statuses[0];
        
    }

    close(){
        this.$uibModalInstance.close();
    }

    updateVolunteer(volunteer){
        console.log("volunteer",volunteer);
        var ctrl = this;

        this.$http.put('/api/users/' + volunteer.userID + '/upsert',volunteer.User)
        .then(res => {
            console.log("RES User update", res);
        })
    
        this.$http.put('/api/volunteers/'+volunteer._id,volunteer)
        .then(res =>{
            console.log("RES Updates",res);
            this.$uibModalInstance.close();
        })
        
    }

}

export default angular.module('refugeeApp.studentNotesModal', ['refugeeApp.auth', 'ui.router'])
  .controller('studentNotesModalController', StudentNotesController)
  .name;

