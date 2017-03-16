'use strict'
export class classesModalController {
    user = {
        name: '',
        email: '',
        role: 'user',
        type: 'student',
        status: '',
        grade: '',
        community: '',
        phone: '',
        gender: '',
        primaryLanguage: '',
        password: ''
    }
    /*@ngInject*/
    constructor($http,$uibModalInstance,Auth, $state,$scope){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;
        this.Auth = Auth;
        this.$state = $state;

        var isStud;
        var addedStudents = {}
        var notAddedStudents = {}
        var stud = this.$resolve.student;
        
        ctrl.thisStudent = stud;

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

    close(){
        this.$uibModalInstance.close();
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

    updateStudent(student) {
        var ctrl = this;

        this.$http.put('/api/users/' + student._id + '/upsert',student)
        .then(res => {
            console.log("RES User update", res);
            this.$uibModalInstance.close();
        })
    }
//    register(form,$http) {
//        var ctrl = this;
//        this.submitted = true;
//
//        if(form.$valid) {
//          return this.Auth.createStudentUser({
//            name: this.user.name,
//            email: this.user.email,
//            gender: this.user.gender,
//            grade: this.user.grade,
//            community: this.user.community,
//            primaryLanguage: this.user.primaryLanguage,
//            organization: this.user.organization,
//            phone: this.user.phone,
//            password: this.user.password,
//            type: this.user.type
//          })
//            .then(() => {
//                // ctrl.studentAdded = this.user.name
//                this.close()
//                ctrl.$resolve.selectedStudent = this.user;
//            })
//            .catch(err => {
//              err = err.data;
//              this.errors = [];
//
//              // Update validity of form fields that match the sequelize errors
//              if(err.name) {
//                angular.forEach(err.fields, field => {
//                    console.log(field,ctrl.errors);
//                    ctrl.errors.push(err)
//                //   this.errors[field] = err.message;
//                });
//              }
//            });
//
//            
//        }
//    }


}

export default angular.module('refugeeApp.studentClassesModal', ['refugeeApp.auth', 'ui.router'])
  .controller('studentClassesModalController', classesModalController)
  .name;
