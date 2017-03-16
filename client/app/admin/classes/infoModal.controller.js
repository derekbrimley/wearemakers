'use strict'
export class InfoModalController {
    /*@ngInject*/
    constructor($http,$uibModalInstance){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;

        console.log(this.$resolve.class);
        this.$http.get('/api/classes/getStudentsFromClass/' + this.$resolve.class._id)
        .then(function(res) {
            console.log("STUDENTS", res);
            ctrl.students = res.data;
        })
    }


    close(){
        this.$uibModalInstance.close();
    }

}

export default angular.module('refugeeApp.classInfoModal', ['refugeeApp.auth', 'ui.router'])
  .controller('classInfoModalController', InfoModalController)
  .name;

