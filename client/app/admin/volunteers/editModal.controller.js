'use strict'
export class EditVolunteerController {
    /*@ngInject*/
    constructor($http,$uibModalInstance){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;

        this.format = 'dd-MMMM-yyyy';
        this.altInputFormats = ['M!/d!/yyyy'];

        this.popup1 = {
            opened: false
        };
        
        this.popup2 = {
            opened: false
        };

        this.hstep = 1;
        this.mstep = 15;
        this.ismeridian = true;

        this.$resolve.class = {
            startTime: new Date(),
            endTime: new Date(),
            startDate: new Date(),
            endDate: new Date()
        }

        this.inlineOptions = {
            customClass: this.getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        this.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        this.dayOptions = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        
        this.today();
        
        
    }

    today() {
        var ctrl = this;
        ctrl.dt = new Date();
    };
//

    clear() {
        var ctrl = this;
        ctrl.dt = null;
    };

    open1 = function() {
        var ctrl = this;
        ctrl.popup1.opened = true;
    };

    open2 = function() {
        var ctrl = this;
        ctrl.popup2.opened = true;
    };

    getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    close(){
        this.$uibModalInstance.close();
    }

    removeClass(course){
        var ctrl = this;
        this.$http.delete('/api/classes/'+course._id)
        .then(function(res){
            console.log("RES",res);
            ctrl.classes.splice(ctrl.classes.indexOf(course),1);
        })
    }

    updateVolunteer(volunteer){
        var ctrl = this;

        this.$http.put('/api/volunteer/'+volunteer._id,volunteer)
        .then(res =>{
            console.log("RES Updates",res);
            this.$uibModalInstance.close();
        })
    }

    addVolunteerDescription(course){
        
    }

    addClass(){
        var ctrl = this;
        this.$http.post('/api/classes',this.$resolve.class)
        .then(function(res){
            console.log("RES",res);
            ctrl.$uibModalInstance.close();
        })
        ctrl.$resolve.selectedCourse = this.$resolve.class;
        
        
//        this.$resolve.class = {
//            startTime: new Date(),
//            endTime: new Date(),
//            startDate: new Date(),
//            endDate: new Date()
//        }
    }

}

export default angular.module('refugeeApp.volunteerModal', ['refugeeApp.auth', 'ui.router'])
  .controller('volunteerModalController', EditVolunteerController)
  .name;

