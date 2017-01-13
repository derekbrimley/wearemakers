'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: require('./login/login.html'),
    controller: 'LoginController',
    controllerAs: 'vm'
  })
    .state('logout', {
      url: '/logout?referrer',
      referrer: 'main',
      template: '',
      controller($state, Auth) {
        'ngInject';

        var referrer = $state.params.referrer || $state.current.referrer || 'main';
        Auth.logout();
        $state.go(referrer);
      }
    })
    .state('signup', {
      url: '/signup',
      template: require('./signup/signup.html'),
      controller: 'SignupController',
      controllerAs: 'vm'
    })
    .state('recovery', {
      url: '/login/recovery',
      template: require('./recovery/recovery.html'),
      controller: 'RecoveryController',
      controllerAs: 'vm'
    })
    .state('recoveryUpdate', {
      url: '/login/recovery/update',
      template: require('./recovery/update.html'),
      controller: 'RecoveryController',
      controllerAs: 'vm'
    })
    .state('confirmed', {
      url: '/login/recovery/confirmed',
      template: require('./recovery/confirmed.html')
    })
    .state('pre_signup', {
      url: '/pre_signup',
      template: require('./presignup/signup.html'),
      controller: 'PreSignupController',
      controllerAs: 'vm'
    })
    .state('settings', {
      url: '/settings',
      template: require('./settings/settings.html'),
      controller: 'SettingsController',
      controllerAs: 'vm',
      authenticate: true
    });
}
