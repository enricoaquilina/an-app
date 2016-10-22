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
    message: HubMessage;

    constructor(
        private _hubService: HubService,
        private _errorService: ErrorService,
        private _authService: AuthService,
        private _fbld: FormBuilder,
        private _router: Router,
        private route: ActivatedRoute
    ) { }


    onSubmit(form: FormGroup){       
        this.message = new HubMessage(form.value.content,this._authService.user.username, this._hubService.hub.title);
        form.reset();

        this._hubService.addHubMessage(this.message)
            .subscribe(
                data => {
                    this._hubService.newMessage.emit(data);
                    this._router.navigate['/h/' + this._hubService.hub.title];
                },
                error => this._errorService.handleError(error)
            );
    }

    ngOnInit(){
        this.sub = this.route
            .params
            .subscribe(params => {
                let title = params['title'];
                var obj = {
                    title: title
                }
                this._hubService.getHubMessages(obj)
                    .subscribe(
                        data => {
                            this.hubMessages = data;
                            console.log(data);
                        },
                        error => this._errorService.handleError(error)
                    );
        });
        this._hubService.newMessage.subscribe(messages => {
            this.hubMessages.push(messages);
        })
        this.form = this._fbld.group({
            content: ['', [<any>Validators.required]],
        });
    }
    isLoggedIn(){
        // return this._authService.isLoggedIn();
    }
    goBack(): void {
        window.history.back();
    }
}