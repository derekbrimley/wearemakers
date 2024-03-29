'use strict';
import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';


import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import student from './student';
import volunteer from './volunteer';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import front from './front/front.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import calendar from '../components/classCalendar';

import './app.scss';

angular.module('refugeeApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, _Auth,
    account, admin, navbar, footer, main, front, constants, util, student, volunteer,calendar
  ])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth, $state) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['refugeeApp'], {
      strictDi: true
    });
  });
