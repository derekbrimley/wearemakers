'use strict'
import editModal from './modal.controller.js';
import addModal from './addModal.controller.js';
import infoModal from './infoModal.controller.js';
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

        ctrl.statuses = ['true','false'];
        ctrl.selected_status = ctrl.statuses[0];

        $http.get('/api/classes')
        .then(function(res){
            console.log("classes",res);
            ctrl.classes = res.data;
        })
      
        ctrl.currentPage = 1;
        ctrl.itemsPerPage = 10;
    }

    setPage(pageNum) {
        var ctrl = this;
        ctrl.currentPage = pageNum;
    }
    
    pageChanged() {
        var ctrl = this;
    }

    getClasses(){
        var ctrl = this;
        this.$http.get('/api/classes')
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
        .then(res =>{
            // console.log("RES",res);
            ctrl.classes.splice(ctrl.classes.indexOf(course),1);
            this.getClasses();
        })
    }

    unArchiveClass(selectedClass){
        var ctrl = this;
        this.$http.get('/api/classes/unArchive/'+selectedClass._id)
        .then(res =>{
            // console.log("RES Updates",res);
            ctrl.classes.splice(ctrl.classes.indexOf(selectedClass),1);
            // var ctrl = this;
            this.getClasses();
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
        var ctrl = this;
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
        })
        
        modalInstance.result.then(function(data) {
        // what you pass in $uibModalInstance.close(true) will be accessible here.
            ctrl.refresh()
        });
    }

    openInfoModal(course) {
        this.selectedCourse = course;
        var modalInstance = this.$uibModal.open({
          template: require('./infoModal.html'),
          controller: 'classInfoModalController',
          bindToController: true,
          controllerAs: 'ctrl',
          resolve: {
             class: () => {
                  return this.selectedCourse;
              }
          }
        })
    }

    refresh(){
        var ctrl = this;
//        this.$http.get('/api/users')
//        .then(function(res){
//            ctrl.students = _.filter(res.data,{type:'student'});
//        })
        
        this.$http.get('/api/classes')
        .then(function(res){
            console.log("classes",res);
            ctrl.classes = res.data;
        })
    }
}

export default angular.module('refugeeApp.adminClasses', ['refugeeApp.auth', 'ui.router', infoModal, editModal, addModal])
  .component('adminClasses', {
      template: require('./index.html'),
      controller: AdminClasses,
      controllerAs: 'ctrl'
  })
  .name;
