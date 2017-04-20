'use strict'
export class ClassEditor {

    /*@ngInject*/
    constructor($http){
        'ngInject'
        this.$http = $http;

    }

    approve(ClassStudent){
        var ctrl = this;

        if(ClassStudent.status == "Active"){
            ClassStudent.status = "Inactive"
        }else{
            ClassStudent.status = "Active"
        }
        this.$http.put('/api/classes/' + ClassStudent.classID + '/students/' + ClassStudent._id,ClassStudent)
        .then(res => {
        })

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
