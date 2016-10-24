import {Component} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'my-logout',
    templateUrl: 'logout.component.html'
})
export class LogoutComponent {
    constructor(private auth: AuthService, 
                private router: Router){}

    onLogout(){
        this.auth.logout();
        this.router.navigate(['signin']);
    }
} 