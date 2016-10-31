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
        private authService: AuthService,
        private errorService: ErrorService
    ) { }
    user: User = null;

    isLoggedIn() {
        return this.authService.isLoggedIn(); 
    }
    isAdmin() {
        return this.authService.user ? this.authService.user.isAdmin : false;
    }
    ngOnInit(){
        this.authService.hasSignedIn.subscribe(user => {
            this.user = user;
        })
        //this is in case a refresh happens  
        var storedUserData = JSON.parse(localStorage.getItem('user')); 
        if ( storedUserData && !this.user ) {
           this.user = storedUserData;
           this.authService.setCurrUser(storedUserData);
           this.authService.hasSignedIn.emit(storedUserData);            
        }
    }
}