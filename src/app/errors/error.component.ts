import {Component, OnInit} from '@angular/core';
import {Error} from './error';
import {ErrorService} from './error.service';

@Component({
    selector: 'error-component',
    templateUrl: 'error.component.html',
    styles: [`
        .backdrop {
            background-color: rgba(0,0,0,0.6);
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
        }
    `],
})
export class ErrorComponent implements OnInit{
    currentError: Error = null;
    errorDisplay : string = 'none';

    constructor(private _errorService: ErrorService){}

    ngOnInit(){
        this._errorService.errorOccurred
        .subscribe(error => {
            this.currentError = error;
            this.errorDisplay = 'block';
        })
    }
    onErrorHandle(){
        this.errorDisplay = 'none';
    }
}