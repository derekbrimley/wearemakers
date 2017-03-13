'use strict'
import editModal from './modal.controller.js';
import addModal from './addModal.controller.js';
export class AdminClasses {
    newClass = {
        startTime: new Date(1970,1,1,8,0,0,0),
        endTime: new Date(1970,1,1,9,0,0,0)
    }
    /*@ngInject*/
    constructor($http, $uibModal){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModal = $uibModal;
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

    addVolunteerDescription(){
        
    }

    showStudents(course) {
        var ctrl = this;
//        course.showStudents = true;

        this.$http.get('/api/classes/getStudentsFromClass/' + course._id)
        .then(function(res) {
            console.log("STUDENTS", res);
            ctrl.students = res.data;
            ctrl.selectedClass = true;
        })
    }

    openModal(course){
        this.selectedCourse = course;
        var modalInstance = this.$uibModal.open({
          template: require('./modal.html'),
          controller: 'classModalController',
          bindToController: true,
          controllerAs: 'ctrl',
          resolve: {
             class: () => {
                  return this.selectedCourse;
              }
          }
        });
    }

    openAddModal(){
        var modalInstance = this.$uibModal.open({
          template: require('./addModal.html'),
          controller: 'classAddModalController',
          bindToController: true,
          controllerAs: 'ctrl',
          resolve: {
             class: () => {
                  return this.selectedCourse;
              }
          }
        });
    }
}

export default angular.module('refugeeApp.adminClasses', ['refugeeApp.auth', 'ui.router', editModal, addModal])
  .component('adminClasses', {
      template: require('./index.html'),
      controller: AdminClasses,
      controllerAs: 'ctrl'
  })
  .name;
