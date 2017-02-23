'use strict'
import moment from 'moment'
import _ from 'lodash'

export class ClassCalendar {
  /*@ngInject*/
  constructor($http) {
    'ngInject'
    var ctrl = this;

    // Get current week
    var startOfWeek = moment().startOf('week');
    var endOfWeek = moment().endOf('week');

    var days = [];
    var day = startOfWeek;
    while (day <= endOfWeek) {
      days.push(day);
      day = day.clone().add(1, 'd');
    }
    ctrl.days = days;

    this.$http = $http;

    $http.get('/api/classes')
      .then(function(res) {
        ctrl.classes = res.data;

      })
  }

  previousWeek() {
    // Get current week
    var startOfWeek = this.days[0].subtract(7, 'd');
    var endOfWeek = this.days[0].clone().add(6, 'd');

    var days = [];
    var day = startOfWeek;
    while (day <= endOfWeek) {
      days.push(day);
      day = day.clone().add(1, 'd');
    }
    this.days = days;
  }

  currentWeek() {
    // Get current week
    var startOfWeek = moment().startOf('week');
    var endOfWeek = moment().endOf('week');

    var days = [];
    var day = startOfWeek;
    while (day <= endOfWeek) {
      days.push(day);
      day = day.clone().add(1, 'd');
    }
    this.days = days;
  }

  nextWeek() {
    // Get current week
    var startOfWeek = this.days[0].add(7, 'd');
    var endOfWeek = startOfWeek.clone().add(6, 'd');

    var days = [];
    var day = startOfWeek;
    while (day <= endOfWeek) {
      days.push(day);
      day = day.clone().add(1, 'd');
    }
    this.days = days;
  }

  createSession(course, date) {
    var ctrl = this;
    var body = {
      classID: course._id,
      date: date.toDate()
    }
    ctrl.$http.post('/api/classes/' + course._id + '/sessions', body)
      .then(function(res) {
        res.data.Class = _.cloneDeep(course);
        res.data.Class.startTime = new Date(course.startTime);
        ctrl.selectedDate = date;
        ctrl.selectedSession = res.data;
        ctrl.selectedSession.SessionVolunteers = [];
      }, function(err) {
        var selectedCourse = _.cloneDeep(course);
        selectedCourse.startTime = new Date(course.startTime);
        err.data.session.Class = selectedCourse;
        ctrl.selectedDate = date;
        ctrl.selectedSession = err.data.session;
      })
  }
}

export default angular.module('components.classCalendar', [])
  .component('classCalendar', {
    template: require('./index.html'),
    controller: ClassCalendar,
    controllerAs: 'ctrl',
    bindings: {
      selectedSession: '='
    }
  })
  .name;
