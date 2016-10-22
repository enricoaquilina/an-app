import {Component, OnInit} from '@angular/core';
import {UserService} from '.././user.service';
import {User} from '.././user';
import {ErrorService} from '../../errors/error.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
    moduleId: module.id,
    selector: 'user-update',
    templateUrl: 'user-update.component.html',
})
export class UserUpdateComponent implements OnInit {
    constructor(
        private _userService: UserService,
        private _errorService: ErrorService,
        private _fbld: FormBuilder,
        private _router: Router,
        private _authService: AuthService
    ) { }
    user: User = null;
    form: FormGroup;

    onClick() {
        this.user = null;
    }
    ngOnInit() {
        this.user = this._userService.user;
        this.form = this._fbld.group({
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
        
        this._userService.updateUser(this.user)
            .subscribe( data => {
            this._router.navigate(['/users']);
        }, function (error) { 
            return this._errorService.handleError(error); 
        });
    };

}