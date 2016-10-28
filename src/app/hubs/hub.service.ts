import {Injectable, EventEmitter} from '@angular/core';
import {Hub} from './hub';
import {HubMessage} from './hub-messages/hub-message';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';


@Injectable()
export class HubService {
    constructor(
        private _http: Http,
        private _router: Router        
    ){}

    hubs: Hub[] = [];
    isEdit = new EventEmitter<Hub>();
    newMessage = new EventEmitter<HubMessage>();
    currentlyDisplayedHubs = new EventEmitter<Hub[]>();

    hub: Hub = null;
    
    addHub (hub) {
        var body = JSON.stringify(hub);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this._http.post('http://localhost:3000/hub' + token, body, { headers: headers })
            .map(function (response) {
            var data = response.json().obj;
            var hub = new Hub(data.title, data.description, data.owner.username, data._id, data.owner._id);
            return hub;
        })
        .catch(function (error) { return Observable.throw(error.json()); });
    };
    addHubMessage(hubMessage) {
        var body = JSON.stringify(hubMessage);
        var headers = new Headers({ 'Content-Type': 'application/json' });
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this._http.post('http://localhost:3000/message'+token, body, { headers: headers })
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
        return this._http.patch('http://localhost:3000/hub/' + hub.hubId + token, body, { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(function (error) { return Observable.throw(error.json()); });
    };
    getHubs() {
        return this._http.get('http://localhost:3000/hub')
            .map(function (response) {
            var data = response.json().obj;
            
            var objs = [];
            for (var i = 0; i < data.length; i++) {
                var hub = new Hub(data[i].title, data[i].description, data[i].owner.username, data[i]._id, data[i].owner._id);
                objs.push(hub);
            }
            this.hubs = objs;
            return objs;
        })
        .catch(function (error) { return Observable.throw(error.json()); });
    };
    getHubMessages(hubTitle) {
        return this._http.get('http://localhost:3000/message/' + hubTitle.title)
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
        this._router.navigate(['/hub/update']);
        this.hub = hubToUpdate;
    };
    deleteHub(hub: Hub) {
        var token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        this.hubs.splice(this.hubs.indexOf(hub), 1);
        this.currentlyDisplayedHubs.emit(this.hubs);

        return this._http.delete('http://localhost:3000/hub/' + hub.hubId + token)
            .map(function (response) { response.json() })
            .catch(function (error) { return Observable.throw(error.json()); });
    };
    
    getHub() {
        return this.hub;
    }
    setHub(hub: Hub) {
        this.hub = hub;
    }   
    setCurrentlyDisplayedHubs(hubs: Hub[]) {
        this.hubs = hubs;
    }
    getCurrentlyDisplayedHubs() {
        return this.currentlyDisplayedHubs;
    }

}