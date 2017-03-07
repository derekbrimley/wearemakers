'use strict'
export class ModalController {
    newClass = {
        startTime: new Date(1970,1,1,8,0,0,0),
        endTime: new Date(1970,1,1,9,0,0,0)
    }
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
        
        this.hstep = 1;
        this.mstep = 15;
        this.ismeridian = true;
        
        this.$resolve.class.startTime = new Date(this.$resolve.class.startTime);
        
        this.$resolve.class.endTime = new Date(this.$resolve.class.endTime);
        
        this.$resolve.class.startDate = new Date(this.$resolve.class.startDate);
        
        this.$resolve.class.endDate = new Date(this.$resolve.class.endDate);
        
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

    updateClass(course){
        this.$http.put('/api/classes/'+course._id,course)
        .then(res =>{
            console.log("RES Updates",res);
            this.$uibModalInstance.close();
        })
    }

}

export default angular.module('refugeeApp.classModal', ['refugeeApp.auth', 'ui.router'])
  .controller('classModalController', ModalController)
  .name;
