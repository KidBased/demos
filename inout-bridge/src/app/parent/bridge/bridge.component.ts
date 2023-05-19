import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-bridge',
  templateUrl: './bridge.component.html',
  styleUrls: ['./bridge.component.scss']
})
export class BridgeComponent {
  @Input() showMsg: boolean = false;
  @Output() showMsgChange = new EventEmitter<boolean>();

  onToggleMsg(value: boolean) {
    this.showMsg = value;
    this.showMsgChange.emit(this.showMsg);
  }
}
