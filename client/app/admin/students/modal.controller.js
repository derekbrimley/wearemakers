'use strict'
export class ModalController {
    /*@ngInject*/
    constructor($http,$uibModalInstance){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;
    }

    close(){
        this.$uibModalInstance.close();
    }


}

export default angular.module('refugeeApp.studentModal', ['refugeeApp.auth', 'ui.router'])
  .controller('studentModalController', ModalController)
  .name;
