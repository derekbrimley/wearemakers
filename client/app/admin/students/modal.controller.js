'use strict'
export class ModalController {
    newClass = {
        startTime: new Date(1970,1,1,8,0,0,0),
        endTime: new Date(1970,1,1,9,0,0,0)
    }
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

    removeClass(course){
        var ctrl = this;
        this.$http.delete('/api/classes/'+course._id)
        .then(function(res){
            console.log("RES",res);
            ctrl.classes.splice(ctrl.classes.indexOf(course),1);
        })
    }

    select(course,saved){
        var ctrl = this;
        course.startTime = new Date(course.startTime);
        course.endTime = new Date(course.endTime);
        ctrl.selectedClassEdit = course;

        course.saved = saved;
    }

    updateClass(){
        this.$http.put('/api/classes/'+this.selectedClassEdit._id,this.selectedClassEdit)
        .then(res =>{
            console.log("RES Updates",res);
        })
    }

}

export default angular.module('refugeeApp.classModal', ['refugeeApp.auth', 'ui.router'])
  .controller('classModalController', ModalController)
  .name;