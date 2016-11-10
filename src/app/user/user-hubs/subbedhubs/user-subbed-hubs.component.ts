import {Component, OnInit} from '@angular/core';
import {User} from '../../user-model';
import {UserService} from '../../user.service';
import {ErrorService} from '../../../errors/error.service';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';
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
        private authService: AuthService
    ) { }
    userSubbedHubs: Hub[];

    ngOnInit() {
      this.userSubbedHubs = this.authService.getCurrUser().subbedHubs;
    }
    searchUser(){
        
    }
}