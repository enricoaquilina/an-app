import {Injectable, EventEmitter} from '@angular/core';
import {User} from './user-model';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';

@Injectable()
export class UserService {
    user: User = null;
    users: User[] = [];

    userToUpdate = new EventEmitter<User>();
    currentlyDisplayedUsers = new EventEmitter<User[]>();
    
    constructor(
        private _http: Http,
        private _router: Router
    ) { }

    getUsers() {
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this._http.get('http://localhost:3000/user' + token)
            .map(function (response) {
            var data = response.json().obj;
            var objs = [];
            for (var i = 0; i < data.length; i++) {
                var user = new User(
                        data[i].username,'',data[i].email, 
                        data[i].firstName, data[i].lastName,
                        data[i].isAdmin, data[i]._id);
                objs.push(user);
            }
            return objs;
        })
        .catch(function (error) { return Observable.throw(error.json()); });
    };
    deleteUser(user: User) {
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        this.users.splice(this.users.indexOf(user), 1);
        this.currentlyDisplayedUsers.emit(this.users);

        return this._http.delete('http://localhost:3000/user/' + user.username + token)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return Observable.throw(error.json()); });
    }
    updateUser(user){
        var body = JSON.stringify(user);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        var identifier = user._id ? user._id : user.identifier;
        return this._http.patch('http://localhost:3000/user/' + identifier + token, body, { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(function (error) { return Observable.throw(error.json()); });
    }
    getUser() {
        return this.user;
    }
    getCurrentlyDisplayedUsers() {
        return this.currentlyDisplayedUsers;
    }
    setUser(userToUpdate: User) {
        this.user = userToUpdate;
    }
    setCurrentlyDisplayedUsers(users: User[]) {
        this.users = users;
    }
}