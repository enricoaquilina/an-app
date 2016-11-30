import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {HubService} from '../../hubs/hub.service';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
    selector: 'my-logout',
    templateUrl: 'logout.component.html'
})
export class LogoutComponent implements OnInit{
    constructor(private authService: AuthService, 
                private hubService: HubService, 
                private userService: UserService, 
                private router: Router){}

    ngOnInit() {
        if(!this.authService.isLoggedIn()) {
            this.router.navigate(['/signin']);
            return false;
        }
    }

    onLogout(){
        this.authService.logout();
        this.hubService.setHub(null);
        this.hubService.setCurrentlyDisplayedHubs([]);
        this.userService.setUser(null);
        this.router.navigate(['signin']);
    }


} 