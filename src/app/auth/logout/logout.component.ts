import {Component} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'my-logout',
    templateUrl: 'logout.component.html'
})
export class LogoutComponent {
    constructor(private _auth: AuthService, private _router: Router){}

    onLogout(){
        this._auth.logout();
        this._router.navigate(['signin']);
    }
} 