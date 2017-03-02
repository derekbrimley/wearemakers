'use strict'
export class AdminStudents {
    newSudent = {
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
    constructor($http){
        'ngInject'

        var ctrl = this;
        this.$http = $http;

        $http.get('/api/users')
        .then(function(res){
            ctrl.students = _.filter(res.data,{type:'student'});
        })

        ctrl.grades = ['1','2','3','4','5','6','7','8','9','10','11','12'];

        // ctrl.grades = ctrl.grades[0];
    }

    addStudent(){
        var ctrl = this;
        this.$http.post('/api/students',this.newStudent)
        .then(function(res){
            console.log("RES",res);
            this.students.push(res.data)
        })

        this.newStudent = {
            startTime: new Date(1970,1,1,8,0,0,0),
            endTime: new Date(1970,1,1,9,0,0,0)
        }
    }

    showStudents(stud){
        var ctrl = this;
        var isStud;
        var addedStudents = {}
        var notAddedStudents = {}

        this.$http.get('/api/classes/')
        .then(function(res){
            ctrl.selectedStudent = res.data   
            angular.forEach(ctrl.selectedStudent, function(classStud, key) {
                isStud = 0;
                angular.forEach(classStud.ClassStudents,function(student,key2){
                    if(stud._id ==student.userID){
                        addedStudents[classStud.name]=student
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

    select(student,saved){
        var ctrl = this;
        student.name = student.name;
        student.email = student.email;
        student.community = student.community;
        student.grade = student.grade;
        student.phone = student.phone;
        student.gender = student.gender;
        student.primaryLanguage = student.primaryLanguage;
        ctrl.showStudentsEdit = student;
        console.log(student)
        student.saved=saved  
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
            console.log("RES User update", res);
        })
        
    }

    removeStudent(course){
        var ctrl = this;
        this.$http.delete('/api/students/'+course._id)
        .then(function(res){
            console.log("RES",res);
            ctrl.students.splice(ctrl.students.indexOf(course),1);
        })
    }

     updateStudent() {
        console.log("USER ID", this.showStudentsEdit._id);
        this.$http.put('/api/users/' + this.showStudentsEdit._id + '/upsert',this.showStudentsEdit)
        .then(res => {
            console.log("RES User update", res);
        })
    }
}

export default angular.module('refugeeApp.adminStudents', ['refugeeApp.auth', 'ui.router'])
  .component('adminStudents', {
      template: require('./index.html'),
      controller: AdminStudents,
      controllerAs: 'ctrl'
  })
  .name;
