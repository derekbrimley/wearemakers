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

        ctrl.statuses = ['active','pending','inactive'];
        ctrl.selected_status = ctrl.statuses[0];
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
            //this.$http.get('/api/classes/' + course._id +'/students/showStudents' )
            this.$http.get('/api/classes/showStudents/' + stud._id)
            .then(function(res){
                console.log("RES",res.data);
                ctrl.selectedStudent = res.data
        })
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
