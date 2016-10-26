import {Component} from '@angular/core';
import {AuthService} from '../auth.service';
import {HubService} from '../../hubs/hub.service';
import {Router} from '@angular/router';

@Component({
    selector: 'my-logout',
    templateUrl: 'logout.component.html'
})
export class LogoutComponent {
    constructor(private authService: AuthService, 
                private hubService: HubService, 
                private router: Router){}

    onLogout(){
        this.authService.logout();
        // this.hubService.setHub(null);
        this.router.navigate(['signin']);
    }
} 