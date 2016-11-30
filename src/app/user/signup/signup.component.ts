import {User} from '../user-model';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {AppValidators} from '../../validators';
import {Component, OnInit} from '@angular/core';
import {ErrorService} from '../../errors/error.service';
import {UserService} from '.././user.service';
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
        private errorService: ErrorService,
        private authService: AuthService,
        private userService: UserService,
        private fbld: FormBuilder,
        private router: Router
    ) { }

    onSubmit(form: any) {        
        let newUser: User = new User(form.username, form.password, form.email);

        this.authService.addUser(newUser)
            .subscribe(
                data => {
                    this.router.navigate(['/signin']);
                },
                error => this.errorService.handleError(error)
            );
    }
    
    ngOnInit() {
        this.form = this.fbld.group({
            username: ['', [<any>Validators.required, <any>Validators.minLength(3)]],
            email: ['', [<any>Validators.required,AppValidators.isEmail]],
            password: ['', [<any>Validators.required, <any>Validators.minLength(8)]]
        });
        
        if(this.isLoggedIn()) {
            this.router.navigate(['/']);
            return false;
        }
        
    }
    isLoggedIn() {
        return this.authService.isLoggedIn();
    }
}