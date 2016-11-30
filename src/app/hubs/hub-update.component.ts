import {Component,OnInit} from '@angular/core';
import {HubService} from './hub.service';
import {ErrorService} from '../errors/error.service';
import {AuthService} from '../user/auth.service';
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
            this.router.navigate(['/signin']);
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
        let updatedHub = new Hub(form.title, form.description, this.hub._id);
        let user = this.authService.getCurrUser();

        this.hubService.updateHub(updatedHub)
            .subscribe( 
                data => {
                    let updated = data.obj;
                    this.hub.title = updated.title;
                    this.hub.description = updated.description;                    
                    this.router.navigate(['/ownedhubs/' + user.username]);
                }, 
                error => { 
                    this.router.navigate(['/ownedhubs/' + user.username]);
                    return this.errorService.handleError(error); 
                }
            );
    };
    goBack() {
        window.history.back();
    }
}