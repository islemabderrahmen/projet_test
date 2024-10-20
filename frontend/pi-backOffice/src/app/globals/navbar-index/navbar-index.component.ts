import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { Authentication } from 'src/app/service/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar-index',
  templateUrl: './navbar-index.component.html',
  styleUrls: ['./navbar-index.component.css'],
})
export class NavbarIndexComponent {
  constructor(
    private router: Router,
    private consumer: Authentication,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {}
  login: boolean = false;
  currentLanguage!: string;
  user!: any;
  userImage!: any;
  ngOnInit() {
    this.login = this.consumer.isLoggedIn;
    this.user = this.consumer.user;
    this.getUserImage();
    this.currentLanguage = localStorage.getItem('selectedLanguage') || 'fr';
  }

  changeLanguage(language: string) {
    localStorage.setItem('selectedLanguage', language);
    this.translateService.use(language);
    this.currentLanguage = language;
  }

  logout() {
    this.consumer.logout().subscribe({
      next: () => {
        if (this.consumer.clearTimeout) { 
          clearTimeout(this.consumer.clearTimeout);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this.consumer.isLoggedIn = false;
        this.login = false;
        this.user = null;
        window.location.reload();
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }

  getUserImage() {
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
