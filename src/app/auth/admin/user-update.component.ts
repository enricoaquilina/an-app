import {Component, OnInit} from '@angular/core';
import {UserService} from '.././user.service';
import {User} from '.././user';
import {ErrorService} from '../../errors/error.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {AppComponent} from '../../app.component';

@Component({
    selector: 'user-update',
    templateUrl: 'user-update.component.html',
})
export class UserUpdateComponent implements OnInit {
    constructor(
        private userService: UserService,
        private errorService: ErrorService,
        private fbld: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) { }
    user: User = null;
    form: FormGroup;

    onClick() {
        this.user = null;
    }
    ngOnInit() {
        this.authService.hasSignedIn.subscribe(user => {
            this.user = user;
        })
        // this.user = this.userService.user;
        this.form = this.fbld.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            firstName: [''],
            lastName: [''],
            admin: ['']
        });
    };
    onSubmit(form: any) {
        this.user.username = form.username;
        this.user.email = form.email;
        this.user.firstName = form.firstName;
        this.user.lastName = form.lastName;
        this.user.isAdmin = form.admin;
        
        this.userService.updateUser(this.user)
            .subscribe( data => {
            this.router.navigate(['/users']);
        }, function (error) { 
            return this._errorService.handleError(error); 
        });
    };

}