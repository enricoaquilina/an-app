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

    editHub(){
        this.hubService.editHub(this.hub);
    }
    deleteHub(){
        this.hubService.deleteHub(this.hub)
            .subscribe(
                data => {
                    let updatedUser = this.authService.getCurrUser();
                    updatedUser.ownedHubs.pop();
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    this.authService.hasSignedIn.emit(updatedUser);
                    this.router.navigate(['/']);
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
    }
    isOwner(){
        return this.authService.isOwner(this.hub.ownerId);
    }
    isLoggedIn(){
        return this.authService.isLoggedIn();
    }
}