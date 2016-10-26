import {Component, OnInit} from '@angular/core';
import {Hub} from './hub';
import {HubService} from './hub.service';
import {HubMessage} from './hub-messages/hub-message';
import {ErrorService} from '../errors/error.service';
import {AuthService} from '../auth/auth.service';
import {AppValidators} from '../validators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'hub-main',
    templateUrl: 'hub-main.component.html',
})
export class HubMainComponent implements OnInit{
    hubMessages: HubMessage[] = [];
    private sub: Subscription;
    form: FormGroup;
    message: HubMessage = null;

    constructor(
        private hubService: HubService,
        private errorService: ErrorService,
        private authService: AuthService,
        private fbld: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) { }


    onSubmit(form: FormGroup){       
        // this.message = new HubMessage(form.value.content,this.authService.user.username, this.hubService.hub.title);
        console.log(form.value.content);
        console.log(this.authService.getCurrUser());
        console.log(this.hubService.hub);
        return false;
        // this.hubService.addHubMessage(this.message)
        //     .subscribe(
        //         data => {
        //             this.hubService.newMessage.emit(data);
        //             this.router.navigate['/h/' + this.hubService.hub.title];
        //         },
        //         error => this.errorService.handleError(error)
        //     );
        // form.reset();
    }

    ngOnInit(){
            console.log(this.hubService.hub);
        this.sub = this.route
            .params
            .subscribe(params => {
                let title = params['title'];
                var obj = {
                    title: title
                }
                this.hubService.getHubMessages(obj)
                    .subscribe(
                        data => {
                            this.hubMessages = data;
                        },
                        error => this.errorService.handleError(error)
                    );
        });
        
        this.hubService.newMessage.subscribe(messages => {
            this.hubMessages.push(messages);
        })
        this.form = this.fbld.group({
            content: ['', [<any>Validators.required]],
        });
    }
    isLoggedIn(){
        return this.authService.isLoggedIn();
    }
    goBack(): void {
        window.history.back();
    }
}