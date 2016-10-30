import {User} from '../user';
import {Router} from '@angular/router';
import {UserService} from '../user.service';
import {Component, Input} from '@angular/core';
import {ErrorService} from '../../errors/error.service';

@Component({
    selector: 'user-component',
    templateUrl: 'user.component.html'
})
export class UserComponent {
   @Input() user: User;
  
    constructor(
        private userService: UserService,
        private router: Router,
        private errorService: ErrorService
    ) { }

    viewUserProfile(){
        // this._router.navigate(['/f/'+this.user.username]);
    }
    followUser(){

    }
    editUser(){
        this.userService.setUser(this.user);
        this.router.navigate(['/user/update']);
    }
    deleteUser(){
        this.userService.deleteUser(this.user)
            .subscribe(
                data => this.router.navigate(['/']),
                error => this.errorService.handleError(error)
            );
    }
}