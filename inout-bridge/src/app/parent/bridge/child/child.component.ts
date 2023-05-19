import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent {
  @Input() showMsg: boolean = false;
  @Output() showMsgChange = new EventEmitter<boolean>();

  toggleMsg() {
    this.showMsg = false;
    this.showMsgChange.emit(this.showMsg);
  }
}
