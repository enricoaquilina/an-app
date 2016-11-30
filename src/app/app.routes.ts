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

import {AuthGuard} from './guards/auth-guard';
import {AdminGuard} from './guards/admin-guard';

const APP_ROUTES: Routes = [
    {path: '', component: HubListComponent},
    {path: 'hub/create', component: HubFormComponent, canActivate: [AuthGuard]},
    {path: 'hub/update', component: HubUpdateComponent, canActivate: [AuthGuard]},
    {path: 'h/:title', component: HubMainComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'signin', component: SigninComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'users', component: UserListComponent, canActivate: [AuthGuard, AdminGuard]},
    {path: 'user/update', component: UserUpdateComponent, canActivate: [AuthGuard]},
    {path: 'profile', component: ProfileUpdateComponent, canActivate: [AuthGuard]},
    {path: 'ownedhubs/:username', component: UserOwnedHubsComponent, canActivate: [AuthGuard]},
    {path: 'subscribedhubs/:username', component: UserSubbedHubsComponent, canActivate: [AuthGuard]}
];

export const ROUTING = RouterModule.forRoot(APP_ROUTES);