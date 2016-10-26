import {User} from '../user';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {AppValidators} from '../../validators';
import {Component, OnInit} from '@angular/core';
import {ErrorService} from '../../errors/error.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'signin-component',
    templateUrl: 'signin.component.html'
})

export class SigninComponent implements OnInit{
    myForm: FormGroup;

    constructor(
        private _fb: FormBuilder, 
        private authService: AuthService,
        private router: Router,
        private errorService: ErrorService
    ) { }

    onSubmit(){
        var user = new User(this.myForm.value.username, this.myForm.value.password);
        this.myForm.reset();
  
        this.authService.signInUser(user)
            .subscribe(
                data => {
   	                this.authService.setCurrUser(data.obj);
                    this.authService.hasSignedIn.emit(user);
                    
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    this.router.navigate(['/']);
                },
                error => this.errorService.handleError(error)
            );
    }

    ngOnInit(){
        this.myForm = this._fb.group({
            username: ['', Validators.compose([Validators.required])],
            password: ['', Validators.required],
        });
    }
}