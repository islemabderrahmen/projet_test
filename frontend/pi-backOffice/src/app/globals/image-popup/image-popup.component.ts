import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-popup',
  templateUrl: './image-popup.component.html',
  styleUrls: ['./image-popup.component.css'],
})
export class ImagePopupComponent {
  @Input() image!: any;
  @Output() confirm = new EventEmitter();
  initialImage: any;
  imageFile: File | undefined;

  ngOnInit() {
    this.initialImage = this.image;
  }

  closeDialog() {
    this.image = this.initialImage;
    const modelDiv = document.getElementById('popup');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }
  handleImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  confirmImage() {
    this.confirm.emit(this.imageFile);
    this.closeDialog();
  }  
}
