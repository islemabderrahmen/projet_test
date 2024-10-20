import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-dialog',
  templateUrl: './popup-dialog.component.html',
  styleUrls: ['./popup-dialog.component.css']
})
export class PopupDialogComponent {
  @Input() id!: any;
  @Input() title!: any;
  @Input() content!: any;
  @Output() send = new EventEmitter();
  
  closeDialog() {
    const modelDiv = document.getElementById('popup');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }

  confirm() {
    this.send.emit(this.id);
    this.closeDialog();
  }
  
}
