'use strict';

import angular from 'angular';

export default class PreSignupController {
  email;
  errors = {};
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state, $http) {
    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
  }

  register(form) {
    this.submitted = true;
    this.$http.post('/api/preSignup/',{email:this.email});
  }
}
