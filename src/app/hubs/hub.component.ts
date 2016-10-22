import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Hub} from './hub';
import {HubService} from './hub.service';
import {AuthService} from '../auth/auth.service';
import {ErrorService} from '../errors/error.service';
import {Router} from '@angular/router';

@Component({
    selector: 'hub-area',
    templateUrl: 'hub.component.html',
    styleUrls: ['hub.component.css'],
})
export class HubComponent{
    @Input() hub: Hub;
    @Output() editClicked = new EventEmitter<Hub>();

    constructor(
        private _hubService: HubService, 
        private _authService: AuthService, 
        private _errorService: ErrorService,
        private _router: Router
    ){};

    color = 'white';
    show = true;
    editHub(){
        this._hubService.editHub(this.hub);
    }
    deleteHub(){
        this._hubService.deleteHub(this.hub)
            .subscribe(
                data => this._router.navigate(['/']),
                error => this._errorService.handleError(error)
            );
    }
    viewHub(){
        // this._router.navigateByUrl('/h/title'+this.hub.title);
        this._router.navigate(['/h', this.hub.title]);
        this._hubService.hub = this.hub;
        // this._hubService.hubViewEvt.emit(this.hub);
    }
    subscribeHub(){

    }
    isOwner(){
        return this._authService.isOwner(this.hub.ownerId);
    }
    isLoggedIn(){
        return this._authService.isLoggedIn();
    }
}