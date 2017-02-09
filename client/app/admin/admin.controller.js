'use strict';
import _ from 'lodash';

export default class AdminController {
  list='users';
  /*@ngInject*/
  constructor(User, $http, $state) {
    // Use the User $resource to fetch all users
    var ctrl = this;
    this.users = User.query(function(users){
        console.log("USERS",users);
        ctrl.admins = _.filter(users,{role:'admin'})
    })
    this.$http = $http;

    switch($state.current.name){
        case 'admin.classes':
            ctrl.tab = 2;
            break;
        case 'admin.students':
            ctrl.tab = 3;
            break;
        case 'admin.volunteers':
            ctrl.tab = 4;
            break;
        case 'admin.scheduling':
            ctrl.tab = 5;
            break;
        default:
            ctrl.tab = 0;
    }
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }

  promote(user){
      var ctrl = this;
      console.log("TEST",user);
      this.$http.get('/api/users/'+user._id+'/promote')
      .then(function(res){
          if(res.status == 200){
              ctrl.admins.push(user);
          }
      })
  }

  revoke(user){
      var ctrl = this;
      this.$http.get('/api/users/'+user._id+'/revoke')
      .then(function(res){
          if(res.status == 200){
              ctrl.admins.splice(ctrl.admins.indexOf(user),1);
          }
      })
  }

}
