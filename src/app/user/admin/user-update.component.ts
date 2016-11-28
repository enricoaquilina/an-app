import {Component, OnInit} from '@angular/core';
import {UserService} from '.././user.service';
import {User} from '.././user-model';
import {ErrorService} from '../../errors/error.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {AppComponent} from '../../app.component';
import {AppValidators} from '../../validators';

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

    goBack() {
        window.history.back();
    }
    ngOnInit() {
        this.form = this.fbld.group({
            username: ['', [<any>Validators.required, <any>Validators.minLength(3)]],
            email: ['', [<any>Validators.required, AppValidators.isEmail]],
            firstName: [''],
            lastName: [''],
            isAdmin: ['']
        });
        this.user = this.userService.getUser();

        if(!this.user && !this.authService.getCurrUser().isAdmin) {
            this.router.navigate(['/']);
            return false;
        }
    };
    onSubmit(form: any) {
        let newUserDetails = new User(
            form.username,
            form.password,
            form.email,
            this.user._id,
            null,
            null,
            form.firstName,
            form.lastName,
            form.isAdmin
        );      
        console.log(newUserDetails);  
        this.userService.updateUser(newUserDetails)
            .subscribe( 
                data => {
                    this.router.navigate(['/users']);
                }, 
                error => {
                    this.form.patchValue({username: this.user.username});
                    this.form.patchValue({email: this.user.email});
                    this.form.patchValue({firstName: this.user.firstName});
                    this.form.patchValue({lastName: this.user.lastName});
                    this.form.patchValue({isAdmin: this.user.isAdmin});
                    this.errorService.handleError(error);
                }
            );
    };
}