'use strict'
export class AdminReports {
    /*@ngInject*/
    constructor($http){
        'ngInject'

        var ctrl = this;
        this.$http = $http;

        this.$http.get('/api/users/countusersbytype/student')
        .then(function(res){
            ctrl.numOfStudents = res.data
        })

        this.$http.get('/api/users/countusersbytype/volunteer')
        .then(function(res){
            ctrl.numOfVolunteers = res.data
        })
    }
}

export default angular.module('refugeeApp.adminReports', ['refugeeApp.auth', 'ui.router'])
  .component('adminReports', {
      template: require('./index.html'),
      controller: AdminReports,
      controllerAs: 'ctrl'
  })
  .name;
