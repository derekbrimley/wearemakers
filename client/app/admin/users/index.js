'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import editModal from './editModal.controller'
     
export class AdminUsers {

    constructor(User, Auth, $state, $http, $uibModal) {
        'ngInject';
        var ctrl = this;
        this.$uibModal = $uibModal;
      
        this.$http = $http;
        this.users = User.query(function(users){
            ctrl.admins = _.filter(users,{role:'admin'})
        })
      
        ctrl.currentPage = 1;
        ctrl.itemsPerPage = 10;
    }

    delete(user) {
        user.$remove();
        this.users.splice(this.users.indexOf(user), 1);
    }

    promote(user){
        var ctrl = this;
        this.$http.get('/api/users/'+user._id+'/promote')
        .then(function(res){
            if(res.status == 200){
                ctrl.admins.push(user);
            }
        })
      
        
    }

    setPage(pageNum) {
        var ctrl = this;
        ctrl.currentPage = pageNum;
    }
    
    pageChanged() {
        var ctrl = this;
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
  
  openEditModal(user){
      this.selectedUser = user;
      var ctrl = this;
      var modalInstance = this.$uibModal.open({
        template: require('./editModal.html'),
        controller: 'userEditModalController',
        bindToController: true,
        controllerAs: 'ctrl',
        resolve: {
           user: () => {

                return this.selectedUser;
            }
        }
      })

      modalInstance.result.then(function(data) {
      // what you pass in $uibModalInstance.close(true) will be accessible here.
          ctrl.refresh()
      });
  }
  
  refresh(){
      var ctrl = this;
      this.$http.get('/api/users/')
      .then(res => {
          ctrl.users = res.data;
      })
  }

}



export default angular.module('refugeeApp.adminUsers', [uiRouter, editModal])
  .component('adminUsers', {
    template: require('./index.html'),
    controller: AdminUsers,
    controllerAs: 'ctrl'
  })
  .name;