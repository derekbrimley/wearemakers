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

    updateStudent(student) {
        var ctrl = this;

        this.$http.put('/api/users/' + student._id + '/upsert',student)
        .then(res => {
            this.$uibModalInstance.close();
        })
    }

}

export default angular.module('refugeeApp.studentEditModal', ['refugeeApp.auth', 'ui.router'])
  .controller('studentEditModalController', editModalController)
  .name;
