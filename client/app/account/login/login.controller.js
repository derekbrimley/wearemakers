'use strict';

export default class LoginController {
  user = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(res => {
          console.log(res);
          // Logged in, redirect to home
          if(res.role == 'admin') {
              this.$state.go('admin');
          } else if(res.type == 'volunteer') {
              this.$state.go('volunteer');
          } else if(res.type == 'student') {
              this.$state.go('student');
          }
          
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
