import {Component, OnInit} from '@angular/core';
import {Hub} from './hub';
import {HubService} from './hub.service';
import {ErrorService} from '../errors/error.service';
import {AuthService} from '../auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
    selector: 'hub-form',
    templateUrl: 'hub-form.component.html',
})
export class HubFormComponent implements OnInit{
    form: FormGroup;

    constructor(
        private hubService: HubService,
        private errorService: ErrorService,
        private authService: AuthService,
        private fbld: FormBuilder,
        private router: Router
    ) { }
    hub: Hub = null;

    onSubmit(form: any){        
        const hub: Hub = new Hub(form.title.trim(), form.description);
        this.hubService.addHub(hub)
            .subscribe(
                data => {
                    this.router.navigate(['/']);
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
        this.form = this.fbld.group({
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