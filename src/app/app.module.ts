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
import {ProfileUpdateComponent} from './user/profile/profile-update.component';
import {SigninComponent} from './user/signin/signin.component';
import {SignupComponent} from './user/signup/signup.component';
import {LogoutComponent} from './user/logout/logout.component';
import {UserListComponent} from './user/admin/user-list.component';
import {UserUpdateComponent} from './user/admin/user-update.component';
import {UserComponent} from './user/admin/user.component';
import {UserHubListComponent} from './user/user-hubs/user-hublist.component';

import {AuthService} from './user/auth.service';
import {UserService} from './user/user.service';
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
        UserUpdateComponent, UserComponent, UserHubListComponent,
        ErrorComponent
        // FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES
    ],
    providers: [ AuthService, UserService, HubService,
     ErrorService, 
    {provide: LocationStrategy, useClass: HashLocationStrategy} ],
    bootstrap: [AppComponent]
})
export class AppModule {
    
}