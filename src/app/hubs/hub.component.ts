import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Hub} from './hub';
import {HubService} from './hub.service';
import {AuthService} from '../user/auth.service';
import {ErrorService} from '../errors/error.service';
import {Router} from '@angular/router';

@Component({
    selector: 'hub-area',
    templateUrl: 'hub.component.html',
    styleUrls: ['hub.component.css'],
})
export class HubComponent{
    @Input() hub: Hub;
    @Output() editClicked = new EventEmitter<Hub>();

    constructor(
        private hubService: HubService, 
        private authService: AuthService, 
        private errorService: ErrorService,
        private router: Router
    ){};

    color = 'white';
    show = true;

    editHub() {
        this.hubService.editHub(this.hub);
    }
    deleteHub() {
        this.hubService.deleteHub(this.hub)
            .subscribe(
                data => {
                    this.authService.setCurrUser(data);
                },
                error => this.errorService.handleError(error)
            );
    }
    viewHub() {
        this.router.navigate(['/h', this.hub.title]);
        this.hubService.setHub(this.hub);
    }
    subscribeHub() {
        //TOFIX
        this.hubService.subscribeToHub(this.hub)
            .subscribe(
                data => {
                    let user = this.authService.getCurrUser();
                    user.subscribedHubs.push(this.hub);
                    this.authService.setCurrUser(user);
                },
                error => this.errorService.handleError(error))
    }
    unsubscribeHub() {
        this.hubService.unsubscribeToHub(this.hub)
            .subscribe(
                data => {
                    let user = this.authService.getCurrUser();
                    user.subscribedHubs.splice(user.subscribedHubs.indexOf(this.hub), 1);
                    this.authService.setCurrUser(user);
                },
                error => this.errorService.handleError(error))
    }
    isSubscribed() {
        let user = this.authService.getCurrUser();                        
        let index = user.subscribedHubs.indexOf(this.hub);;
        return this.authService.isSubscribed(this.hub);
    }
    isOwner() {
        return this.authService.isHubOwner(this.hub);
    }
    isLoggedIn() {
        return this.authService.isLoggedIn();
    }
}