'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('student', {
      url: '/student',
      template: '<student></student>',
      authenticate: 'user'
    })
}
//test change
//test