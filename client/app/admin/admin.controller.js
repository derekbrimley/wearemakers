'use strict';

export default class AdminController {
  list='users';
  /*@ngInject*/
  constructor(User, $http) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    var ctrl = this;
    $http.get('/api/preSignup/').then(function(res){
        ctrl.preUsers = res.data;
    })
    this.$http = $http;
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}
