import {Component, OnInit} from '@angular/core';
import {Hub} from './hub';
import {HubService} from './hub.service';
import {AuthService} from '../user/auth.service';
import {ErrorService} from '../errors/error.service';

@Component({
    selector: 'hub-list',
    templateUrl: 'hub-list.component.html'
})
export class HubListComponent implements OnInit{
    hubs: Hub[] = null;

    constructor(
        private hubService: HubService,
        private authService: AuthService,
        private errorService: ErrorService
    ) { }

    ngOnInit(){
        this.hubService.currentlyDisplayedHubs.subscribe(hubs => {
            this.hubs = hubs;
        })
        let hubs = this.hubService.getCurrentlyDisplayedHubs();

        if(hubs && hubs.length > 0){
            this.hubs = hubs;
        }else {
             this.hubService.getHubs()
                .subscribe(
                    data => {
                        this.hubs = data;
                        this.hubService.setCurrentlyDisplayedHubs(data);
                    },
                    error => this.errorService.handleError(error)
                );
        }
       
    }
}