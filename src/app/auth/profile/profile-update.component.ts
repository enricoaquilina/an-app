import {User} from '.././user';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {UserService} from '.././user.service';
import {Component, OnInit} from '@angular/core';
import {ErrorService} from '../../errors/error.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'profile-component',
    templateUrl: 'profile-update.component.html'
})
export class ProfileUpdateComponent implements OnInit {
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
        this.user = this._authService.user;
        this.form = this._fbld.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            firstName: [''],
            lastName: ['']
        });
    };
    onSubmit(form: any) {
        this.user.username = form.username;
        this.user.email = form.email;
        this.user.firstName = form.firstName;
        this.user.lastName = form.lastName;

        this._userService.updateUser(this.user)
            .subscribe( data => {
            this._authService.hasSignedIn.emit(data.obj);
            this._router.navigate(['/']);
        }, function (error) { 
            return this._errorService.handleError(error); 
        });
    };

}