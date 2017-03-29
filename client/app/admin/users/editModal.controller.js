'use strict'
export class editModalController {
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
        
        ctrl.grades = [1,2,3,4,5,6,7,8,9,10,11,12];

    }

    close(){
        this.$uibModalInstance.close();
    }

    updateUser(user) {
        var ctrl = this;

        this.$http.put('/api/users/' + user._id + '/upsert',user)
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

export default angular.module('refugeeApp.userEditModal', ['refugeeApp.auth', 'ui.router'])
  .controller('userEditModalController', editModalController)
  .name;
