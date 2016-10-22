import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {ErrorService} from './errors/error.service';
import {User} from './auth/user';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})


export class AppComponent implements OnInit {
    constructor(
        private _authService: AuthService,
        private _errorService: ErrorService
    ) { }
    user: User = null;

    isLoggedIn() {
        return this._authService.isLoggedIn(); 
    }
    isAdmin() {
        return this._authService.user ? this._authService.user.isAdmin : false;
    }
    ngOnInit(){
        this._authService.hasSignedIn.subscribe(user => {
            this.user = user;
        })
        if(this.user){
            this._authService.getUserDetails()
                .subscribe(
                    data => {
                        this.user = data.obj;
                        this._authService.user = this.user;
                    },
                    error => this._errorService.handleError(error)
                );
        }
    }
}