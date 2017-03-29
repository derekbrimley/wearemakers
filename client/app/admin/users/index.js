'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
     
export class AdminUsers {

    constructor(User, Auth, $state, $http) {
        'ngInject';
        var ctrl = this;

        this.$http = $http;
        this.users = User.query(function(users){
            console.log("USERS",users);
            ctrl.admins = _.filter(users,{role:'admin'})
        })
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



export default angular.module('refugeeApp.adminUsers', [uiRouter])
  .component('adminUsers', {
    template: require('./index.html'),
    controller: AdminUsers,
    controllerAs: 'ctrl'
  })
  .name;