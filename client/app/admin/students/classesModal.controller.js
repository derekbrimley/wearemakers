'use strict'
export class classesModalController {
    user = {
        name: '',
        email: '',
        role: 'user',
        type: 'student',
        status: '',
        grade: '',
        community: '',
        phone: '',
        gender: '',
        primaryLanguage: '',
        password: ''
    }
    /*@ngInject*/
    constructor($http,$uibModalInstance,Auth, $state,$scope){
        'ngInject'

        var ctrl = this;
        this.$http = $http;
        this.$uibModalInstance = $uibModalInstance;
        this.Auth = Auth;
        this.$state = $state;
        var stud = this.$resolve.student;
        this.thisStudent = stud;
        this.showStudents(stud);
        this.totalSessions = 0;
        this.totalAttended = 0;
    }

    close(){
        this.$uibModalInstance.close();
    }

    approveStudent(ClassStudent){
        var ctrl = this;

        if(ClassStudent.status == "Active"){
            ClassStudent.status = "Inactive"
        }else{
            ClassStudent.status = "Active"
        }
        this.$http.put('/api/classes/' + ClassStudent.classID + '/students/' + ClassStudent._id,ClassStudent)
        .then(res => {
        })

    }

    registerStudent(course){
        var ctrl = this;
        var body = {
            userID:ctrl.thisStudent._id
        };
        this.$http.post('/api/classes/' + course._id +'/students/registerforadmin/',body )
        .then(function(res){
            ctrl.showStudents(ctrl.thisStudent)
        })
    }

    totalAttendance(attendance){
        var ctrl = this;
        var studentsTotalAttendance = {}
        var attended = 0;

        angular.forEach(attendance,function(val,key){
            if(val.attendance == 'Absent'){
                ctrl.totalSessions = Number(ctrl.totalSessions) + Number(val.count)
            }else if(val.attendance == 'Excused'){
                ctrl.totalSessions = Number(ctrl.totalSessions) + Number(val.count)
            }else if(val.attendance == 'Attended'){
                ctrl.totalSessions = Number(ctrl.totalSessions) + Number(val.count)
                attended = Number(val.count);
                ctrl.totalAttended = attended;
            }
        });
        studentsTotalAttendance = {
            totalSessions : ctrl.totalSessions,
            attended : attended,
            percent : attended/ctrl.totalSessions
        }
        return (studentsTotalAttendance)
    }
    
    showStudents(stud){
        var ctrl = this;
        var isStud;
        var result;
        var addedStudents = {}
        var notAddedStudents = {}
        var stud = this.$resolve.student;
        
        ctrl.thisStudent = stud;

        this.$http.get('/api/classes/')
        .then(function(res){
            ctrl.selectedStudent = res.data
            angular.forEach(ctrl.selectedStudent, function(classStud, key) {
                isStud = 0;
                angular.forEach(classStud.ClassStudents,function(student,key2){
                    if(stud._id ==student.userID){
                        var body = {
                            classid:classStud._id,
                            studentid:student.userID
                        };

                        ctrl.$http.post('/api/classes/1/sessions/1/students/reports/individualStudentAttendance/',body)
                        .then(function(res){
                            addedStudents[classStud.name]={
                                attendance:res.data,
                                classData:student
                            }
                            result = ctrl.totalAttendance(addedStudents[classStud.name].attendance)          
                        },function(err){
                                addedStudents[classStud.name]={
                                attendance:res.data,
                                classData:student
                            }
                        });
                        
                        isStud = 1;
                    }
                });
                
                if(isStud == 0){
                    notAddedStudents[classStud.name]=classStud
                }
            });
        })
        ctrl.addedStudents = addedStudents
        ctrl.notAddedStudents = notAddedStudents
    }

    updateStudent(student) {
        var ctrl = this;

        this.$http.put('/api/users/' + student._id + '/upsert',student)
        .then(res => {
            this.$uibModalInstance.close();
        })
    }


}

export default angular.module('refugeeApp.studentClassesModal', ['refugeeApp.auth', 'ui.router'])
  .controller('studentClassesModalController', classesModalController)
  .name;
