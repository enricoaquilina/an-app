import {Injectable,EventEmitter} from '@angular/core';
import {User} from './user';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Hub} from '../hubs/hub';
import {HubService} from '../hubs/hub.service';

@Injectable()
export class AuthService{
    constructor(private _http: Http,
                private hubService: HubService){}
    user: User;
    hasSignedIn = new EventEmitter<User>();

    addUser(user: User){
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this._http.post('http://localhost:3000/user/create', body, {headers:headers})
            .map(response => response.json()
                // let user = new User(data.email, data.password, data.firstName, data.lastName);
                // return user;
            )
            .catch(error => Observable.throw(error.json()));
    }
    // removeUser(user: User){
    //      return this._http.delete('http://localhost:3000/user/' + user.username)
    //         .map(response => response.json())
    //         .catch(error => Observable.throw(error.json()));        
    // }
    getCurrUser() {
        return this.user;
    }
    setCurrUser(user: User) {
        this.user = user;
    }
    signInUser(user: User){
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'})
        return this._http.post('http://localhost:3000/user/signin', body, {headers: headers})
            .map(response => 
                response.json()
            )
            .catch(error => Observable.throw(error.json()));
    }
    logout(){
        this.setCurrUser(null);
        this.hubService.setHub(null);
        this.hasSignedIn.emit(this.user);
        localStorage.clear();
    }
    getUserDetails(){
        //get user details again after refresh using his id
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        var userId = JSON.parse(localStorage.getItem('user'))._id ? JSON.parse(localStorage.getItem('user'))._id : '';
        var identifierObject = {
            userId: userId
        }
        const body = JSON.stringify(identifierObject);
        const headers = new Headers({'Content-Type': 'application/json'})
        
        return this._http.post('http://localhost:3000/user' + token, body, {headers: headers})
                   .map(response => {
                       let user = response.json().obj;
                       this.hasSignedIn.emit(user);
                       return user;
                   })
                   .catch(error => Observable.throw(error.json()));    
    }
    isLoggedIn(){
        return localStorage.getItem('token') !== null;
    }
    isAdmin(){
        return this.user? this.user.isAdmin: false;
    }
    isHubOwner(hub: Hub) {       
        let test = hub.ownerUsername === JSON.parse(localStorage.getItem('user')).username;
        return test;
    }
    isOwner(userId: string){
        return JSON.parse(localStorage.getItem('user'))._id == userId;
    }
}