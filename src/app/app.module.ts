import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// import {ROUTING} from './app.routes';


import {AppComponent} from './app.component';

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule],
    declarations: [
        AppComponent
        // FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES
    ],
    providers: [ {provide: LocationStrategy, useClass: HashLocationStrategy} ],
    bootstrap: [AppComponent]
})
export class AppModule {
    
}