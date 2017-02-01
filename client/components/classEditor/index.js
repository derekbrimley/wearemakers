'use strict'
export class ClassEditor {

    /*@ngInject*/
    constructor($http){
        'ngInject'


    }
}

export default angular.module('components.classEditor', [])
  .component('classEditor', {
      template: require('./index.html'),
      controller: ClassEditor,
      controllerAs: 'ctrl',
      bindings:{
          class: '=',
          update: '&'
      }
  })
  .name;
