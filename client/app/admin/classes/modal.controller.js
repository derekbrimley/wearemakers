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

        // Init uploader
        ctrl.uploader = new FileUploader();
        ctrl.uploader.autoUpload = false;
        ctrl.uploader.removeAfterUpload = true;
        ctrl.uploader.method = "POST"
        ctrl.uploader.url=`/api/classes/${this.$resolve.class._id}/materials`;
        ctrl.uploader.onAfterAddingFile = function(item){
            ctrl.uploader.uploadItem(0);
            ctrl.uploading = true;
        }
        ctrl.uploader.onSuccessItem = function(item,response,status,headers){
            console.log("SUCCESS",response);
            ctrl.uploading = false;
            ctrl.$resolve.class.documentURL = response.documentURL;
            ctrl.$resolve.class.documentName = response.documentName;
        }
        ctrl.uploader.onErrorItem = function(item,response,status,headers){
            console.log("Err",response);
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
            console.log("RES",res);
            ctrl.classes.splice(ctrl.classes.indexOf(course),1);
        })
    }

    updateClass(course){
        var ctrl = this;
//        var f = document.getElementById('file').files[0],
//            r = new FileReader();
//        console.log(f);
//        course.volunteerInfo = f.name;
//        if(f instanceof Blob) {
//            console.log("is blob");
//            r.onloadend = function(e){
//                console.log("onloadend");
//                console.log(e.target);
//                var data = e.target.result;
//                //send your binary data via $http or $resource or do anything else with it
////                console.log(data);
//                ctrl.$http.post('/api/classes/'+course._id+'/materials',data)
//                .then(function(res) {
//                    console.log("FILE",res);
//                })
//            }
//            r.readAsBinaryString(f);
//        }

        this.$http.put('/api/classes/'+course._id,course)
        .then(res =>{
            console.log("RES Updates",res);
            this.$uibModalInstance.close();
        })
    }

    addVolunteerDescription(course){

    }

}

export default angular.module('refugeeApp.classModal', ['refugeeApp.auth', 'ui.router','angularFileUpload'])
  .controller('classModalController', AddModalController)
  .name;
