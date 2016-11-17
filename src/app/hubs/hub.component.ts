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
    deleteHub(){
        this.hubService.deleteHub(this.hub)
            .subscribe(
                data => {
                    this.authService.setCurrUser(data);
                },
                error => this.errorService.handleError(error)
            );
    }
    viewHub(){
        this.router.navigate(['/h', this.hub.title]);
        this.hubService.setHub(this.hub);
    }
    subscribeHub(){
        //TODO
        this.hubService.subscribeToHub(this.hub)
            .subscribe(
                data => {
                    let user = this.authService.getCurrUser();
                    user.subscribedHubs.push(data.obj);
                    this.authService.setCurrUser(user);
                },
                error => this.errorService.handleError(error)
            )
    }
    isOwner(){
        return this.authService.isHubOwner(this.hub);
    }
    isLoggedIn(){
        return this.authService.isLoggedIn();
    }
}