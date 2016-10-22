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
        private _errorService: ErrorService,
        private _userService: UserService,
        private _router: Router,
        private _authService: AuthService
    ) { }

    ngOnInit() {
        const isAdmin: boolean = this._authService.isAdmin();
        
        if(!isAdmin){
            this._router.navigate(['/']);
            return;
        }
        this._userService.getUsers()
            .subscribe(
                data => {
                    this.users = data;
                },
                error => {
                    this._router.navigate(['/']);
                    this._errorService.handleError(error);
                }
            );
    }
    searchUser(){
        
    }
}