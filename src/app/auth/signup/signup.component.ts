import {User} from '../user';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {AppValidators} from '../../validators';
import {Component, OnInit} from '@angular/core';
import {ErrorService} from '../../errors/error.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'signup-component',
    templateUrl: 'signup.component.html'
})
export class SignupComponent implements OnInit{
    form: FormGroup;
    
    // username: Control;
    // email: Control;
    // password: Control;

    constructor(
        private _errorService: ErrorService,
        private _authService: AuthService,
        private _fbld: FormBuilder,
        private _router: Router
    ) { }

    onSubmit(form: any) {        
        const user: User = new User(form.username, form.password, form.email);
        this._authService.addUser(user)
            .subscribe(
                data => {
                    this._router.navigate(['/signin']);
                },
                error => this._errorService.handleError(error)
            );
    }
    
    ngOnInit() {
        this.form = this._fbld.group({
            username: ['', [<any>Validators.required, <any>Validators.minLength(3)]],
            email: ['', [<any>Validators.required,AppValidators.isEmail]],
            password: ['', [<any>Validators.required, <any>Validators.minLength(8)]]
        });
    }
    isLoggedIn() {
        return this._authService.isLoggedIn();
    }
}