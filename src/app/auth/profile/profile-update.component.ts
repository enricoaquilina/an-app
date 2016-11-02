import {User} from '.././user';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {UserService} from '.././user.service';
import {Component, OnInit} from '@angular/core';
import {ErrorService} from '../../errors/error.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppComponent} from '../../app.component';
import {AppValidators} from '../../validators';

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
    user: User = null;
    form: FormGroup;

    goBack() {
        window.history.back();
    }
    ngOnInit() {
        this.form = this.fbld.group({
            username: ['', [<any>Validators.required, <any>Validators.minLength(3)]],
            email: ['', [<any>Validators.required, AppValidators.isEmail]],
            firstName: ['', <any>Validators.minLength(2)],
            lastName: ['', <any>Validators.minLength(2)],
        });
        this.user = this.authService.getCurrUser();
        // if(!this.user){
        //     this.router.navigate(['/']);
        //     return;
        // }


        this.authService.hasSignedIn.subscribe(user => {
            this.user = user;
        })
    };
    onSubmit(form: any) {
        this.user = new User(form.username, form.email, form.firstName, form.lastName);
        console.log(this.user);

        // this.userService.updateUser(this.user)
        //     .subscribe( 
        //         data => {
        //             this.authService.hasSignedIn.emit(data.obj);
        //             this.router.navigate(['/']);
        //         }, 
        //         error => { 
        //             return this.errorService.handleError(error); 
        //         }
        //     );
    };

}