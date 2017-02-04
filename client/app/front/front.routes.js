'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('front', {
    url: '/',
    template: require('./front.html')
  })
  
  .state('front.who-we-work-with', {
    url: '/who-we-work-with',
    template: require('./who-we-work-with.html')
  })
}
