import {User} from '.././user';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {UserService} from '.././user.service';
import {Component, OnInit} from '@angular/core';
import {ErrorService} from '../../errors/error.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppComponent} from '../../app.component';

@Component({
    selector: 'profile-component',
    templateUrl: 'profile-update.component.html'
})
export class ProfileUpdateComponent implements OnInit {
    constructor(
        private userService: UserService,
        private errorService: ErrorService,
        private fbld: FormBuilder,
        private router: Router,
        private authService: AuthService

    ) { }
    user: User;
    form: FormGroup;

    goBack() {
        window.history.back();
    }
    ngOnInit() {
        this.authService.hasSignedIn.subscribe(user => {
            // if(user)
            this.user = user;
        })
        this.user = this.authService.getCurrUser();
        this.form = this.fbld.group({
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

        this.userService.updateUser(this.user)
            .subscribe( data => {
            this.authService.hasSignedIn.emit(data.obj);
            this.router.navigate(['/']);
        }, function (error) { 
            return this._errorService.handleError(error); 
        });
    };

}