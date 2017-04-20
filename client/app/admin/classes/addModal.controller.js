'use strict'
const fileUpload = require('angular-file-upload');
export class AddModalController {
    newClass = {
        startTime: new Date(1970,1,1,8,0,0,0),
        endTime: new Date(1970,1,1,9,0,0,0)
    }
    /*@ngInject*/
    constructor($http,$uibModalInstance,FileUploader){
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

        // Init uploader
        ctrl.uploader = new FileUploader();
        ctrl.uploader.autoUpload = false;
        ctrl.uploader.removeAfterUpload = true;
        ctrl.uploader.method = "POST"
        ctrl.uploader.url=`/api/classes/new/materials`;
        ctrl.uploader.onAfterAddingFile = function(item){
            ctrl.uploader.uploadItem(0);
            ctrl.uploading = true;
        }
        ctrl.uploader.onSuccessItem = function(item,response,status,headers){
            ctrl.uploading = false;
            ctrl.$resolve.class.documentURL = response.documentURL;
            ctrl.$resolve.class.documentName = response.documentName;
        }
        ctrl.uploader.onErrorItem = function(item,response,status,headers){
        }

        ctrl.upload = function(file){
            ctrl.uploader.uploadItem(0);
        }
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
            ctrl.classes.splice(ctrl.classes.indexOf(course),1);
        })
    }

    updateClass(course){
        var ctrl = this;

        this.$http.put('/api/classes/'+course._id,course)
        .then(res =>{
            this.$uibModalInstance.close();
        })
    }

    addVolunteerDescription(course){

    }

    addClass(){
        var ctrl = this;
        this.$http.post('/api/classes',this.$resolve.class)
        .then(function(res){
            ctrl.$uibModalInstance.close();
        })
        ctrl.$resolve.selectedCourse = this.$resolve.class;


    }

}

export default angular.module('refugeeApp.addClassModal', ['refugeeApp.auth', 'ui.router','angularFileUpload'])
  .controller('classAddModalController', AddModalController)
  .name;
