import {Component, OnInit} from '@angular/core';
import {User} from '../../user-model';
import {UserService} from '../../user.service';
import {ErrorService} from '../../../errors/error.service';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {HubService} from '../../../hubs/hub.service';
import {Hub} from '../../../hubs/hub';

@Component({
    selector: 'user-owned-hubs',
    templateUrl: 'user-owned-hubs.component.html',
})
export class UserOwnedHubsComponent implements OnInit{
    constructor(
        private errorService: ErrorService,
        private userService: UserService,
        private router: Router,
        private authService: AuthService,
        private hubService: HubService
    ) { }
    
    userOwnedHubs: Hub[];
    user: User;

    ngOnInit() {
        this.authService.hasSignedIn.subscribe(user => {
            this.user = user;
            this.userOwnedHubs = this.user ? this.user.ownedHubs: [];
            console.log('in the user owned hubs component');            
        })
        if(!this.user) {
            console.log('here in the second part of the user owned component');
            console.log(this.authService.getCurrUser());
            this.userOwnedHubs = this.authService.getCurrUser().ownedHubs;
        }
    }
    searchUser(){
        
    }
}