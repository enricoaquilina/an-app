import {Routes, RouterModule} from '@angular/router';

import {SignupComponent} from './user/signup/signup.component';
import {SigninComponent} from './user/signin/signin.component';

import {HubMainComponent} from './hubs/hub-main.component';
import {HubFormComponent} from './hubs/hub-form.component';
import {HubUpdateComponent} from './hubs/hub-update.component';
import {LogoutComponent} from './user/logout/logout.component';
import {UserUpdateComponent} from './user/admin/user-update.component';
import {ProfileUpdateComponent} from './user/profile/profile-update.component';

import {HubListComponent} from './hubs/hub-list.component';
import {UserListComponent} from './user/admin/user-list.component';
import {UserOwnedHubsComponent} from './user/user-hubs/ownedhubs/user-owned-hubs.component';
import {UserSubbedHubsComponent} from './user/user-hubs/subbedhubs/user-subbed-hubs.component';

const APP_ROUTES: Routes = [
    {path: '', component: HubListComponent},
    {path: 'hub/create', component: HubFormComponent},
    {path: 'hub/update', component: HubUpdateComponent},
    {path: 'h/:title', component: HubMainComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'signin', component: SigninComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'users', component: UserListComponent},
    {path: 'user/update', component: UserUpdateComponent},
    {path: 'profile', component: ProfileUpdateComponent},
    {path: 'ownedhubs/:username', component: UserOwnedHubsComponent},
    {path: 'subscribedhubs/:username', component: UserSubbedHubsComponent}
];

export const ROUTING = RouterModule.forRoot(APP_ROUTES);