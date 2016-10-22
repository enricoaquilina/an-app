import {AbstractControl} from '@angular/forms';

export class AppValidators {
    static points = 0;

    static isEmail(control: AbstractControl): {[s: string]: boolean} {
        if (!control.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
            return {invalidMail: true};
        }
    }
    static isSecure(control: AbstractControl): {[s: string]: boolean} {    
        var p = 0;
        for (var char of control.value) {
            if(char == char.toUpperCase()){
                p++;
            }
            if(char == char.toLowerCase()){
                p++;
            }
            if(!isNaN(char)){
                p++;
            }
            if(char.match(/^[a-zA-Z0-9- ]*$/)){
                p++;
            }
        }
        console.log(p);
        if(p>=4){
            return {secure:true};
        }
    }
}