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
        private _hubService: HubService,
        private _errorService: ErrorService,
        private _authService: AuthService,
        private _fbld: FormBuilder,
        private _router: Router
    ) { }
    hub: Hub = null;
    form: FormGroup;

    onClick() {
        this.hub = null;
    };

    ngOnInit() {
        this.hub = this._hubService.hub;
        this.form = this._fbld.group({
            title: ['', Validators.required],
            description: ['', Validators.required]
        });
    };

    isLoggedIn() {
        return this._authService.isLoggedIn();
    };

    onSubmit(form: any) {
        this.hub.title = form.title;
        this.hub.description = form.description;
        this._hubService.updateHub(this.hub)
            .subscribe( data => {
            this._router.navigate(['/']);
        }, function (error) { 
            return this._errorService.handleError(error); 
        });
    };
}