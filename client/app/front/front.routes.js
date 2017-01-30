'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('front', {
    url: '/',
    template: require('./front.html')
  })
}
