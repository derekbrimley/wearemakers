'use strict'
export class ModalController {
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
    }

    close(){
        this.$uibModalInstance.close();
    }

    register(form,$http) {
        var ctrl = this;
        this.submitted = true;

        if(form.$valid) {
          return this.Auth.createStudentUser({
            name: this.user.name,
            email: this.user.email,
            gender: this.user.gender,
            grade: this.user.grade,
            community: this.user.community,
            primaryLanguage: this.user.primaryLanguage,
            organization: this.user.organization,
            phone: this.user.phone,
            password: this.user.password,
            type: this.user.type
          })
            .then(() => {
                // ctrl.studentAdded = this.user.name
                this.close()
                ctrl.$resolve.selectedStudent = this.user;
            })
            .catch(err => {
              err = err.data;
              this.errors = [];

              // Update validity of form fields that match the sequelize errors
              if(err.name) {
                angular.forEach(err.fields, field => {
                    ctrl.errors.push(err)
                });
              }
            });

            
        }
    }


}

export default angular.module('refugeeApp.studentModal', ['refugeeApp.auth', 'ui.router'])
  .controller('studentModalController', ModalController)
  .name;
