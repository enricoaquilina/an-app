import {Component, OnInit} from '@angular/core';
import {Hub} from './hub';
import {HubService} from './hub.service';
import {ErrorService} from '../errors/error.service';
import {AuthService} from '../user/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
    selector: 'hub-form',
    templateUrl: 'hub-form.component.html',
})
export class HubFormComponent implements OnInit{
    hubForm: FormGroup;

    constructor(
        private hubService: HubService,
        private errorService: ErrorService,
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router
    ) { }
    hub: Hub = null;

    onSubmit(form: any){        
        const hub: Hub = new Hub(form.title.trim().toLowerCase(), form.description);
        this.hubService.addHub(hub)
            .subscribe(
                data => {
                    console.log(data);
                    console.log('here');

                    // var hub = new Hub(data.title, data.description, data.owner.username, data._id, data.owner._id);           
                    // let updatedUser = JSON.parse(localStorage.getItem('user'));
                    // updatedUser.ownedHubs.push(data);
                    // console.log(updatedUser);

                    // localStorage.setItem('user', JSON.stringify(updatedUser));
                    
                    // this.authService.hasSignedIn.emit(updatedUser);
                    // this.router.navigate(['/']);
                },
                error => this.errorService.handleError(error)
            );
    }
    onClick(){
        this.hub = null;
    }
    ngOnInit(){
        const logged: boolean = this.isLoggedIn();
        if(!logged){
            this.router.navigate(['/']);
        }
        this.hubForm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required]
        });
    }
    isLoggedIn(){
        return this.authService.isLoggedIn();
    }
    goBack() {
        window.history.back();
    }
}