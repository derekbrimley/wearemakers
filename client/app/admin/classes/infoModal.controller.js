'use strict'
export class InfoModalController {
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

export default angular.module('refugeeApp.classInfoModal', ['refugeeApp.auth', 'ui.router'])
  .controller('classInfoModalController', InfoModalController)
  .name;

