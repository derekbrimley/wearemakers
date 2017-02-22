'use strict'
export class AdminReports {
    /*@ngInject*/
    constructor($http){
        'ngInject'

        var ctrl = this;
        this.$http = $http;

    }
}

export default angular.module('refugeeApp.adminReports', ['refugeeApp.auth', 'ui.router'])
  .component('adminReports', {
      template: require('./index.html'),
      controller: AdminReports,
      controllerAs: 'ctrl'
  })
  .name;
