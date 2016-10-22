import {Component, OnInit, Input} from '@angular/core';
import {HubMessage} from './hub-message';

@Component({
    selector: 'hub-message',
    templateUrl: 'hub-message.component.html',
})
export class HubMessageComponent {
    @Input() message: HubMessage;


}