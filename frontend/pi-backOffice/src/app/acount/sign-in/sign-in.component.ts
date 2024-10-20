import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../../service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../model/user';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  signInForm!: FormGroup;
  isLoading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private consumer: Authentication,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login(form: any) {
    this.isLoading = true;
    this.consumer.login(form).subscribe({
      next: (response) => {
        const loginResponse = response as {
          access_token: string;
          refresh_token: string;
          expires_in: string;
        };
        this.consumer.updateToken(loginResponse.access_token);
        this.checkValidity(loginResponse);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error(error.error.message);
      },
    });
  }

  checkValidity(loginResponse: any) {
    this.consumer.checkValidity().subscribe({
      next: () => {
        localStorage.setItem(
          'token',
          JSON.stringify(loginResponse.access_token)
        );
        localStorage.setItem(
          'refresh_token',
          JSON.stringify(loginResponse.refresh_token)
        );
        this.getUser(
          loginResponse.access_token,
          loginResponse.refresh_token,
        );
        const decodedToken = jwtDecode(loginResponse.access_token) as any;
        const expirationTime = new Date(decodedToken.exp * 1000).getTime();
        this.consumer.autoLogout(expirationTime);
        this.consumer.isLoggedIn = true;
        this.router.navigateByUrl('/').then(() => {
          window.location.reload();
        });
        this.isLoading = false;
      },
      error: (error) => {
        if (error.error.message == 'Not verified') {
          this.router.navigate(['/emailVerification']);
        } else if (error.error.message == 'Not approved') {
          this.router.navigate(['/notApproved']);
        } else {
          this.toastr.error(error.error.message);
        }
        this.isLoading = false;
      },
    });
  }

  getUser(token: string, refreshToken: string) {
    this.consumer.getUser(token).subscribe({
      next: (response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.consumer.updateLocals(response, token, refreshToken);
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      },
    });
  }
}

