'use strict'
export class AdminClasses {
    newClass = {
        startTime: new Date(1970,1,1,8,0,0,0),
        endTime: new Date(1970,1,1,9,0,0,0)
    }
    /*@ngInject*/
    constructor($http){
        'ngInject'

        var ctrl = this;
        this.$http = $http;

        $http.get('/api/classes')
        .then(function(res){
            console.log("classes",res);
            ctrl.classes = res.data;
        })
    }

    addClass(){
        var ctrl = this;
        this.$http.post('/api/classes',this.newClass)
        .then(function(res){
            console.log("RES",res);
            this.classes.push(res.data)
            ctrl.showAdd=false;
        })

        this.newClass = {
            startTime: new Date(1970,1,1,8,0,0,0),
            endTime: new Date(1970,1,1,9,0,0,0)
        }
    }

    removeClass(course){
        var ctrl = this;
        this.$http.delete('/api/classes/'+course._id)
        .then(function(res){
            console.log("RES",res);
            ctrl.classes.splice(ctrl.classes.indexOf(course),1);
        })
    }

    select(course){
        var ctrl = this;
        course.startTime = new Date(course.startTime);
        course.endTime = new Date(course.endTime);
        ctrl.selectedClass = course;
    }

    updateClass(){
        this.$http.put('/api/classes/'+this.selectedClass._id,this.selectedClass)
        .then(res =>{
            console.log("RES Updates",res);
        })
    }
}

export default angular.module('refugeeApp.adminClasses', ['refugeeApp.auth', 'ui.router'])
  .component('adminClasses', {
      template: require('./index.html'),
      controller: AdminClasses,
      controllerAs: 'ctrl'
  })
  .name;
