import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './front.routes';

export class FrontController {

  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http,$state,$location) {
    //TODO:   Change this after launch
    // if($location.host() != 'localhost'){
    //     $state.go('pre_signup');
    // }
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
      });
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}

export default angular.module('refugeeApp.front', [uiRouter])
  .config(routing)
  .component('front', {
    template: require('./front.html'),
    controller: FrontController
  })
  .name;
