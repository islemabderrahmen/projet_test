import { Component } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


import { Authentication } from 'src/app/service/authentication.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  constructor(
    private consumer: Authentication,
    private toastr: ToastrService,
    private router: Router
  ) {}
  userData: any;
  userImage: any;
  ngOnInit() {
    this.userData = this.consumer.getUserFromLocal;
    this.getUserImage();
  }

  openDialog() {
    const modelDiv = document.getElementById('popup');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }

  onConfirm(image: File) {
    const formData = new FormData();
    if (image) {
      formData.append('image', image, image.name);
      this.consumer.updateImage(formData).subscribe({
        next: (response) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.consumer.updateLocalUser(response);
          this.toastr.success('Your account has been updated successfully');
          this.router.navigateByUrl('/profile').then(() => {
            setTimeout(() => {
              location.reload();
              this.getUserImage();
              
            }, 3000);
          });
        },
        error: (error) => {
          this.toastr.error(error.error.message);
        },
      });
    } else {
      this.toastr.error('No image selected.');
    }
  }
  getUserImage(){
    this.consumer.getUserImage().subscribe({
      next: (response) => {
        this.userImage = URL.createObjectURL(response);
        console.log(this.userImage);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
