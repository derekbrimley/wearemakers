'use strict'
import moment from 'moment'
export class AdminScheduling {

    /*@ngInject*/
    constructor($http){
        'ngInject'
        var ctrl = this;

        // Get current week
        var startOfWeek = moment().startOf('week');
        var endOfWeek = moment().endOf('week');

        var days = [];
        var day = startOfWeek;
        while (day <= endOfWeek) {
            days.push(day);
            day = day.clone().add(1, 'd');
        }
        ctrl.days = days;

        this.$http = $http;

        $http.get('/api/classes')
        .then(function(res){
            console.log("classes",res);
            ctrl.classes = res.data;

        })
    }

    previousWeek(){
        // Get current week
        var startOfWeek = this.days[0].subtract(7,'d');
        var endOfWeek =  this.days[0].clone().add(6,'d');

        var days = [];
        var day = startOfWeek;
        while (day <= endOfWeek) {
            days.push(day);
            day = day.clone().add(1, 'd');
        }
        this.days = days;
    }

    currentWeek(){
        // Get current week
        var startOfWeek = moment().startOf('week');
        var endOfWeek = moment().endOf('week');

        var days = [];
        var day = startOfWeek;
        while (day <= endOfWeek) {
            days.push(day);
            day = day.clone().add(1, 'd');
        }
        this.days = days;
    }

    nextWeek(){
        // Get current week
        var startOfWeek = this.days[0].add(7,'d');
        var endOfWeek =  startOfWeek.clone().add(6,'d');

        var days = [];
        var day = startOfWeek;
        while (day <= endOfWeek) {
            console.log(day,endOfWeek);
            days.push(day);
            day = day.clone().add(1, 'd');
        }
        this.days = days;
    }
}

export default angular.module('refugeeApp.adminScheduling', ['refugeeApp.auth', 'ui.router'])
  .component('adminScheduling', {
      template: require('./index.html'),
      controller: AdminScheduling,
      controllerAs: 'ctrl'
  })
  .name;
