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
  .state('admin.users', {
    url: '/users',
    template: '<admin-users></admin-users>',
    authenticate: 'admin',
    parent:'admin'
  })
  .state('admin.admins', {
    url: '/admins',
    template: '<admin-admins></admin-admins>',
    authenticate: 'admin',
    parent:'admin'
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
  .state('admin.reports', {
    url: '/reports',
    template: '<admin-reports></admin-reports>',
    authenticate: 'admin',
    parent:'admin'
  })
}
