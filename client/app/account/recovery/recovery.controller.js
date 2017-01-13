'use strict';

export default class LoginController {
  user = {
    email: ''
  };
  errors = {
    login: undefined
  };
  password;
  confirmPassword;
  match = false;
  submitted = false;
  updated = false;


  /*@ngInject*/
  constructor(Auth, $state, $http, $location) {
    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
    this.invalidToken = false;
    this.validToken = false;
    // Controller code for the update password page
    if($state.current.name == 'recoveryUpdate'){
        if($location.search().token){
            var ctrl = this
            $http.get('/auth/recovery/'+$location.search().token+'/validate')
            .then(function(response){
                if(response.data.valid){
                    ctrl.token = $location.search().token
                    ctrl.validToken = true;
                }
                else{
                    ctrl.invalidToken = true;
                }
            })
        }
        else{
            this.invalidToken = true;
        }
    }
  }

  update(form){
      var $state = this.$state;
      this.submitted = true;
      this.match = false;
      var ctrl = this
      if(this.password == this.confirmPassword){
          this.match = true;
      }
      console.log(this.match);
      console.log(this.password);
      console.log(this.confirmPassword);
      if(form.$valid && this.match) {
          console.log(this.password);
        //   return;
        this.$http.post('/auth/recovery/'+this.token,{password:this.password}).then(function(response){
            // $state.go('confirmed')
            ctrl.$state.go('login');
        })
      }
  }

  recover(form) {
    this.submitted = true;
    var $state = this.$state;
    console.log(this.user.email);
    if(form.$valid) {
      this.$http.post('/auth/recovery',{email:this.user.email}).then(function(response){
          $state.go('confirmed')
      })
    }
  }
}
