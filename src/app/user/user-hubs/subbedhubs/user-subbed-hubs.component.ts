import {Component, OnInit} from '@angular/core';
import {User} from '../../user-model';
import {UserService} from '../../user.service';
import {ErrorService} from '../../../errors/error.service';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {HubService} from '../../../hubs/hub.service';
import {Hub} from '../../../hubs/hub';

@Component({
    selector: 'user-subbed-hubs',
    templateUrl: 'user-subbed-hubs.component.html',
})
export class UserSubbedHubsComponent implements OnInit{    
    constructor(
        private errorService: ErrorService,
        private userService: UserService,
        private router: Router,
        private authService: AuthService,
        private hubService: HubService
    ) { }

    userSubscribedHubs: Hub[];
    user: User;

    ngOnInit() {
        this.authService.hasSignedIn.subscribe(user => {
            this.user = user;
            this.userSubscribedHubs = this.user ? this.user.subscribedHubs: [];
        })
        if(!this.user) {
            this.userSubscribedHubs = this.authService.getCurrUser().subscribedHubs;
        }
    }
    searchUser(){
        
    }
}