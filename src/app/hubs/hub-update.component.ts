import {Component,OnInit} from '@angular/core';
import {HubService} from './hub.service';
import {ErrorService} from '../errors/error.service';
import {AuthService} from '../auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Hub} from './hub';
import {Router} from '@angular/router';

@Component({
    selector: 'hub-update',
    templateUrl: 'hub-update.component.html'
})

export class HubUpdateComponent implements OnInit{
    constructor(
        private hubService: HubService,
        private errorService: ErrorService,
        private authService: AuthService,
        private fbld: FormBuilder,
        private router: Router
    ) { }
    hub: Hub = null;
    form: FormGroup;

    ngOnInit() {
        this.form = this.fbld.group({
            title: ['', Validators.required],
            description: ['', Validators.required]
        });
        this.hub = this.hubService.getHub() ? this.hubService.getHub() : null;

        if(!this.hub) {
            this.router.navigate(['/']);
            return false;
        }
        if( this.hub && !this.authService.isHubOwner(this.hub)) {
            this.router.navigate(['/']);
            return false;
        }
    };
    isLoggedIn() {
        return this.authService.isLoggedIn();
    };
    onSubmit(form: any) {
        this.hub.title = form.title;
        this.hub.description = form.description;
        this.hubService.updateHub(this.hub)
            .subscribe( 
                data => {
                    this.router.navigate(['/']);
                }, 
                error => { 
                    return this.errorService.handleError(error); 
                }
            );
    };
    goBack() {
        window.history.back();
    }
}