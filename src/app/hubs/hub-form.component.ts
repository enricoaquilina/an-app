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
        private _hubService: HubService,
        private _errorService: ErrorService,
        private _authService: AuthService,
        private _fbld: FormBuilder,
        private _router: Router
    ) { }
    hub: Hub = null;

    onSubmit(form: any){        
        const hub: Hub = new Hub(form.title.trim(), form.description);
        this._hubService.addHub(hub)
            .subscribe(
                data => {
                    this._router.navigate(['/']);
                },
                error => this._errorService.handleError(error)
            );
    }
    onClick(){
        this.hub = null;
    }
    ngOnInit(){
        const logged: boolean = this.isLoggedIn();
        if(!logged){
            this._router.navigate(['/']);
        }
        this.form = this._fbld.group({
            title: ['', Validators.required],
            description: ['', Validators.required]
        });
    }
    isLoggedIn(){
        return this._authService.isLoggedIn();
    }
    goBack() {
        window.history.back();
    }
}