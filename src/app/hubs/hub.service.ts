import {Injectable, EventEmitter} from '@angular/core';
import {Hub} from './hub';
import {HubMessage} from './hub-messages/hub-message';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
import {User} from '../user/user-model';
import {AuthService} from '../user/auth.service';
import {ErrorService} from '../errors/error.service';

@Injectable()
export class HubService {
    constructor(
        private http: Http,
        private router: Router,
        private errorService: ErrorService,
        private authService: AuthService  
    ) { }

    hubs: Hub[] = [];
    isEdit = new EventEmitter<Hub>();
    newMessage = new EventEmitter<HubMessage>();
    currentlyDisplayedHubs = new EventEmitter<Hub[]>();

    hub: Hub = null;
    
    addHub(hub: Hub) {
        var body = JSON.stringify(hub);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';

        return this.http.post('http://localhost:3000/hub/ownedhubs' + token, body, { headers: headers })
            .map(function (response) {
            var data = response.json().obj;

            let user = JSON.parse(localStorage.getItem('user'));
            let hubToAdd = new Hub(
                data.title, 
                data.description,
                data._id,
                {
                    _id: data.owner._id,                
                    username: data.owner.username
                }
            );
            user.ownedHubs.push(hubToAdd);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        })
        .catch(function (error) { 
            return Observable.throw(error); 
        });
    }

    addHubMessage(hubMessage) {
        var body = JSON.stringify(hubMessage);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.post('http://localhost:3000/message'+token, body, { headers: headers })
            .map(function (response) {
            var data = response.json().obj;
            return data;
        })
        .catch(function (error) { return Observable.throw(error.json()); });
    }
    updateHub(hub: Hub) {
        var body = JSON.stringify(hub);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.patch('http://localhost:3000/hub/' + hub._id + token, body, { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(function (error) { return Observable.throw(error.json()); });
    }
    subscribeToHub(hub: Hub) {
        let user = this.authService.getCurrUser();
        var body = JSON.stringify(hub);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.patch('http://localhost:3000/hub/subscribedhubs/' + user._id + token, body, { headers: headers })
            .map(function (response) {
                return response.json(); 
            })
            .catch(function (error) { return Observable.throw(error.json()); });
    }
    unsubscribeToHub(hub: Hub) {
        let user = this.authService.getCurrUser();
        var body = JSON.stringify(hub);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.patch('http://localhost:3000/hub/subscribedhubs/' + user._id + token, body, { headers: headers })
            .map(function (response) {
                return response.json(); 
            })
            .catch(function (error) { return Observable.throw(error.json()); });
    }
    getHubs() {
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';

        return this.http.get('http://localhost:3000/hub' + token)
            .map(function (response) {
            var data = response.json().obj;
            let user = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null;
            var objs = [];
            for (var i = 0; i < data.length; i++) {
                let hub = {
                    title: data[i].title, 
                    description: data[i].description,
                    owner:
                    {
                        username: data[i].owner.username, 
                        email: data[i].owner.email,
                        firstName: data[i].owner.firstName,
                        lastName: data[i].owner.lastName,
                        _id: data[i].owner._id,
                    }, 
                    _id: data[i]._id,
                };
                objs.push(hub);
            }
            return objs;
        })
        .catch(function (error) { return Observable.throw(error.json()); });
    }
    getHubMessages(hubTitle: string) {
        return this.http.get('http://localhost:3000/message/' + hubTitle)
            .map(function (response) {
            var data = response.json().obj;
            var objs = [];

             for (var i = 0; i < data.length; i++) {
                var date = new Date(data[i].creationDate);
                var dateFormatted = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear();
                var message = new HubMessage(data[i].content, data[i].user.username, data[i].parentHub, dateFormatted);
                objs.push(message);
            }
            return objs;
        })
        .catch(function (error) { return Observable.throw(error.json()); });
    }
    editHub(hubToUpdate: Hub) {
        this.router.navigate(['/hub/update']);
        this.hub = hubToUpdate;
    }
    deleteHub(hub: Hub) {
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        let user = this.authService.getCurrUser();
        let hubIndex = user.ownedHubs.findIndex(h => h._id == hub._id.toString());
        hubIndex > -1 ? user.ownedHubs.splice(hubIndex, 1) : user; 

        return this.http.delete('http://localhost:3000/hub/' + hub._id + token)
            .map(function (response) { return user; })
            .catch(function (error) { return Observable.throw(error.json()); });
    }
    getHub() {
        return this.hub;
    }
    setHub(hub: Hub) {
        this.hub = hub;
    }   
    setCurrentlyDisplayedHubs(hubs: Hub[]) {
        this.hubs = hubs;
        this.currentlyDisplayedHubs.emit(hubs);
    }
    getCurrentlyDisplayedHubs() {
        return this.hubs;
    }

}