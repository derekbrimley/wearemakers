'use strict';

import angular from 'angular';

export default class SignupController {
  user = {
    name: '',
    email: '',
    gender: '',
    grade: '',
    community: '',
    primaryLanguage: '',
    organization: '',
    phone: '',
    password: '',
    type:'student'
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state) {
    this.errors = [];
    this.Auth = Auth;
    this.$state = $state;
  }

  register(form) {
      var ctrl = this;
    this.submitted = true;

    if(form.$valid) {
        if(this.user.password != this.user.confirmPassword){
            this.passwordsMatch = false;
            return;
        }
      return this.Auth.createUser({
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
          // Account created, redirect to home
          //this.$state.go('');
         ctrl.addedSuccessfully = true;
        })
        .catch(err => {
          err = err.data;
          this.errors = [];

          // Update validity of form fields that match the sequelize errors
          if(err.name) {
            angular.forEach(err.fields, field => {
                console.log(field,ctrl.errors);
                ctrl.errors.push(err)
            //   this.errors[field] = err.message;
            });
          }
        });
    }
  }
}
