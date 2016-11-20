import {User} from '../user-model';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {AppValidators} from '../../validators';
import {Component, OnInit} from '@angular/core';
import {ErrorService} from '../../errors/error.service';
import {HubService} from '../../hubs/hub.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'signin-component',
    templateUrl: 'signin.component.html'
})

export class SigninComponent implements OnInit{
    myForm: FormGroup;

    constructor(
        private fb: FormBuilder, 
        private authService: AuthService,
        private router: Router,
        private hubService: HubService,
        private errorService: ErrorService
    ) { }

    onSubmit(){
        var user = new User(this.myForm.value.username.toLowerCase().trim(), this.myForm.value.password);
        this.myForm.patchValue({password: ''})
  
        this.authService.signInUser(user)
            .subscribe(
                data => {
                    this.hubService.setCurrentlyDisplayedHubs([]);
                    let user = JSON.parse(data.obj);
   	                this.authService.setCurrUser(user);
                    this.authService.hasSignedIn.emit(user);

                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', data.obj);
                    this.router.navigate(['/']);
                },
                error => this.errorService.handleError(error)
            );
    }

    ngOnInit(){
        this.myForm = this.fb.group({
            username: ['', Validators.compose([Validators.required])],
            password: ['', Validators.required],
        });
    }
}