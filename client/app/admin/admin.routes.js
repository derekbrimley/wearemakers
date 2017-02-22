'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('admin', {
    url: '/admin',
    template: require('./admin.html'),
    controller: 'AdminController',
    controllerAs: 'ctrl',
    authenticate: 'admin'
  })
  .state('admin.classes', {
    url: '/classes',
    template: '<admin-classes></admin-classes>',
    authenticate: 'admin',
    parent:'admin'
  })
  .state('admin.students', {
    url: '/students',
    template: '<admin-students></admin-students>',
    authenticate: 'admin',
    parent:'admin'
  })
  .state('admin.volunteers', {
    url: '/volunteers',
    template: '<admin-volunteers></admin-volunteers>',
    authenticate: 'admin',
    parent:'admin'
  })
  .state('admin.scheduling', {
    url: '/scheduling',
    template: '<admin-scheduling></admin-scheduling>',
    authenticate: 'admin',
    parent:'admin'
  })
  .state('admin.reports', {
    url: '/reports',
    template: '<admin-reports></admin-reports>',
    authenticate: 'admin',
    parent:'admin'
  })
}
