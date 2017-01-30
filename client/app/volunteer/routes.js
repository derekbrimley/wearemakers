'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('volunteer', {
      url: '/volunteer',
      template: '<volunteer></volunteer>',
      authenticate: 'user'
    })
}
