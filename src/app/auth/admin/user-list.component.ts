import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../user.service';
import {ErrorService} from '../../errors/error.service';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
    selector: 'user-list',
    templateUrl: 'user-list.component.html',
})
export class UserListComponent implements OnInit{
    users: User[];
    
    constructor(
        private errorService: ErrorService,
        private userService: UserService,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.userService.currentlyDisplayedUsers.subscribe(users => {
            this.users = users;
        })
        const isAdmin: boolean = this.authService.isAdmin();
        
        if(!isAdmin){
            this.router.navigate(['/']);
            return;
        }
        this.userService.getUsers()
            .subscribe(
                data => {
                    this.users = data;
                    this.userService.setCurrentlyDisplayedUsers(data);
                },
                error => {
                    this.router.navigate(['/']);
                    this.errorService.handleError(error);
                }
            );
    }
    searchUser(){
        
    }
}