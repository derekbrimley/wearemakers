'use strict';

const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './routes';
import _ from 'lodash';

export class VolunteerController {

    list='volunteers';
    user = {
        name: '',
        email: '',
        password: '',
        type:'student'
    };
    submitted = false;

    constructor(Auth, User, $state, $http) {
        'ngInject';
        this.Auth = Auth;
        // Use the User $resource to fetch all users
        var ctrl = this;
        this.volunteers = User.query(function(volunteers){
            console.log("Volunteers",volunteers);
            ctrl.volunteers = _.filter(volunteers,{role:'volunteer'})
        })
        this.volunteer_requests = User.query(function(volunteer_requests) {
            ctrl.volunteer_requests = _.filter(volunteer_requests,{role:'volunteer'});
        })
        this.organizations = [
          {
              name:"Trader Joes",
              date_added:"12/03/16",
              desc:"Brings food during coding classes."
          },
          {
              name:"Adobe",
              date_added:"05/03/16",
              desc:"Provides volunteers for bi-weekly coding class"
          }
        ]

        this.$http = $http;
    }

    delete(user) {
        user.$remove();
        this.volunteers.splice(this.volunteers.indexOf(user), 1);
    }

    create(form) {
        var ctrl = this;
        this.submitted = true;
        
        if(form.$valid) {
            return this.Auth.createUser({
                name: this.user.name,
                email: this.user.email,
                password: this.user.password,
                type: this.user.type
            })
            .then(() => {
                this.$state.go('volunteer');
            })
            .catch(err => {
                err = err.data;
                this.erros = [];
                
                if(err.name) {
                    angular.forEach(err.fields, field => {
                        console.log(field,ctrl.errors);
                        ctrl.errors.push(err)
                    //   this.errors[field] = err.message;
                    });
                }
            });
        }
    }
}

export default angular.module('refugeeApp.volunteer', [uiRouter])
  .config(routes)
  .component('volunteer', {
    template: require('./index.html'),
    controller: VolunteerController,
    controllerAs: 'ctrl'
  })
  .name;
