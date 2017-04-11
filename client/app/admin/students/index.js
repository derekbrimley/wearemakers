'use strict'

import modal from './modal.controller'
import editModal from './editModal.controller'
import notesModal from './notesModal.controller'
import classesModal from './classesModal.controller'

export class AdminStudents {
    /*@ngInject*/
    constructor($http, Auth, $state, $uibModal){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModal = $uibModal;
        this.errors = [];
        this.Auth = Auth;
        this.$state = $state;

        $http.get('/api/users')
        .then(function(res){
            ctrl.students = _.filter(res.data,{type:'student'});
            console.log(ctrl.students)
        })

        ctrl.grades = ['1','2','3','4','5','6','7','8','9','10','11','12'];

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

    showStudents(stud){
        var ctrl = this;
        var isStud;
        var addedStudents = {}
        var notAddedStudents = {}

        ctrl.thisStudent = stud

        this.$http.get('/api/classes/')
        .then(function(res){
            ctrl.selectedStudent = res.data
            angular.forEach(ctrl.selectedStudent, function(classStud, key) {
                isStud = 0;
                angular.forEach(classStud.ClassStudents,function(student,key2){
                    if(stud._id ==student.userID){
                        addedStudents[classStud.name]=student
                        isStud = 1;
                    }
                });
                if(isStud == 0){
                    notAddedStudents[classStud.name]=classStud
                }
            });
        })
        ctrl.addedStudents = addedStudents
        ctrl.notAddedStudents = notAddedStudents
    }

    select(student,saved){
        var ctrl = this;
        student.name = student.name;
        student.email = student.email;
        student.community = student.community;
        student.grade = student.grade;
        student.phone = student.phone;
        student.gender = student.gender;
        student.primaryLanguage = student.primaryLanguage;
        ctrl.showStudentsEdit = student;
        console.log(student)
        student.saved=saved
    }


    approveStudent(ClassStudent){
        var ctrl = this;

        if(ClassStudent.status == "Active"){
            ClassStudent.status = "Inactive"
        }else{
            ClassStudent.status = "Active"
        }
        this.$http.put('/api/classes/' + ClassStudent.classID + '/students/' + ClassStudent._id,ClassStudent)
        .then(res => {
            console.log("RES User update", res);
        })

    }

    removeStudent(course){
        var ctrl = this;
        this.$http.delete('/api/students/'+course._id)
        .then(function(res){
            console.log("RES",res);
            ctrl.students.splice(ctrl.students.indexOf(course),1);
        })
    }

    registerStudent(course){
        var ctrl = this;
        var body = {
            userID:ctrl.thisStudent._id
        };
        this.$http.post('/api/classes/' + course._id +'/students/registerforadmin/',body )
        .then(function(res){
            ctrl.showStudents(ctrl.thisStudent)
        })
    }

     updateStudent() {
        console.log("USER ID", this.showStudentsEdit._id);
        this.$http.put('/api/users/' + this.showStudentsEdit._id + '/upsert',this.showStudentsEdit)
        .then(res => {
            console.log("RES User update", res);
        })
    }

    openEditModal(student) {
        this.selectedStudent = student;
        var ctrl = this;
        var modalInstance = this.$uibModal.open({
          template: require('./editModal.html'),
          controller: 'studentEditModalController',
          bindToController: true,
          controllerAs: 'ctrl',
          resolve: {
             student: () => {
                 
                  return this.selectedStudent;
              }
          }
        })
    }

    openModal(student){
        this.selectedStudent = student;
        var ctrl = this;
        var modalInstance = this.$uibModal.open({
          template: require('./modal.html'),
          controller: 'studentModalController',
          bindToController: true,
          controllerAs: 'ctrl',
          resolve: {
             student: () => {
                 
                  return this.selectedStudent;
              }
          }
        })

        modalInstance.result.then(function(data) {
        // what you pass in $uibModalInstance.close(true) will be accessible here.
            ctrl.refresh()
        });
    }

    openNotesModal(student) {
        this.selectedStudent = student;
        var ctrl = this;
        var modalInstance = this.$uibModal.open({
          template: require('./notesModal.html'),
          controller: 'studentNotesModalController',
          bindToController: true,
          controllerAs: 'ctrl',
          resolve: {
             student: () => {
                 
                  return this.selectedStudent;
              }
          }
        })
    }

    openClassesModal(student) {
        this.selectedStudent = student;
        var ctrl = this;
        var modalInstance = this.$uibModal.open({
          template: require('./classesModal.html'),
          controller: 'studentClassesModalController',
          bindToController: true,
          controllerAs: 'ctrl',
          resolve: {
             student: () => {
                 
                  return this.selectedStudent;
              }
          }
        })
    }

    refresh(){
        var ctrl = this;
        this.$http.get('/api/users')
        .then(function(res){
            ctrl.students = _.filter(res.data,{type:'student'});
        })
    }
    

    
}

export default angular.module('refugeeApp.adminStudents', ['refugeeApp.auth', 'ui.router', modal, editModal, notesModal, classesModal])
  .component('adminStudents', {
      template: require('./index.html'),
      controller: AdminStudents,
      controllerAs: 'ctrl'
  })
  .name;
