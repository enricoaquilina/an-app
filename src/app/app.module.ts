import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from '@angular/material';

import {ROUTING} from './app.routes';

import {AppComponent} from './app.component';
import {HubListComponent} from './hubs/hub-list.component';
import {HubComponent} from './hubs/hub.component';
import {ErrorComponent} from './errors/error.component';
import {HubMainComponent} from './hubs/hub-main.component';
import {HubFormComponent} from './hubs/hub-form.component';
import {HubUpdateComponent} from './hubs/hub-update.component';
import {HubMessageComponent} from './hubs/hub-messages/hub-message.component';
import {ProfileUpdateComponent} from './auth/profile/profile-update.component';
import {SigninComponent} from './auth/signin/signin.component';
import {SignupComponent} from './auth/signup/signup.component';
import {LogoutComponent} from './auth/logout/logout.component';
import {UserListComponent} from './auth/admin/user-list.component';
import {UserUpdateComponent} from './auth/admin/user-update.component';
import {UserComponent} from './auth/admin/user.component';

import {AuthService} from './auth/auth.service';
import {UserService} from './auth/user.service';
import {ErrorService} from './errors/error.service';
import {HubService} from './hubs/hub.service';

@NgModule({
    imports: [
        BrowserModule, HttpModule, MaterialModule.forRoot(), 
        FormsModule, ReactiveFormsModule, ROUTING
    ],
    declarations: [
        AppComponent, HubListComponent, HubComponent, 
        HubMainComponent, HubFormComponent, HubUpdateComponent,
        HubMessageComponent, ProfileUpdateComponent, SigninComponent,
        SignupComponent, LogoutComponent, UserListComponent,
        UserUpdateComponent, UserComponent, ErrorComponent
        // FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES
    ],
    providers: [ AuthService, UserService, HubService,
     ErrorService, 
    {provide: LocationStrategy, useClass: HashLocationStrategy} ],
    bootstrap: [AppComponent]
})
export class AppModule {
    
}