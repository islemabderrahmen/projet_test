import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../model/user';
import { Individu } from '../model/individus';
import { IndividuRole } from '../model/individusRole';
import { Society } from '../model/society';
import { SocietyRole } from '../model/societyRole';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  token: string | null = null;
  isLoggedIn = false;
  refresh_token: string | null = null;
  user: any | null = null;
  verificationToken: string;
  clearTimeout: any;
  url: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.verificationToken = '';
    const output = window.localStorage.getItem('token');
    this.token = output ? JSON.parse(output) : null;
    const output2 = window.localStorage.getItem('refresh_token');
    this.refresh_token = output2 ? JSON.parse(output2) : null;
    const output4 = window.localStorage.getItem('user');
    this.user = output4 ? JSON.parse(output4) : null;
    this.url = environment.apiUrl;
  }

  updateToken(value: string): void {
    this.verificationToken = value;
  }

  updateLocals(user: any, token: string, refresh_token: string) {
    this.user = user;
    this.token = token;
    this.refresh_token = refresh_token;
  }

  updateLocalUser(user: any) {
    this.user = user;
  }

  get displayToken(): string {
    return this.verificationToken;
  }

  get getUserFromLocal(): User | null {
    return this.user;
  }

  login(loginRequest: any) {
    return this.http.post(
      `${this.url}/auth/login`,
      loginRequest,
      httpOptions
    );
  }

  register(registerRequest: any) {
    return this.http.post(
      `${this.url}/auth/create-user`,
      registerRequest,
      httpOptions
    );
  }

  logout() {
    return this.http.post(
      `${this.url}/auth/logout`,
      {
        token: this.refresh_token,
      },
      httpOptions
    );
  }

  checkValidity() {
    return this.http.get(`${this.url}/auth/check-user`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.verificationToken}`,
      }),
    });
  }

  emailVerification() {
    return this.http.put(
      `${this.url}/auth/emailVerification`,
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.verificationToken}`,
        }),
      }
    );
  }

  autoLogin() {
    if (this.token) {
      const currentDate = new Date().getTime();
      const decodedToken: { exp?: number } = jwtDecode(this.token);
      if (decodedToken.exp !== undefined) {
        const tokenExpirationDate = new Date(decodedToken.exp * 1000).getTime();
        if (tokenExpirationDate > currentDate) {
          const remainingTime = tokenExpirationDate - currentDate;
          this.isLoggedIn = true;
          this.autoLogout(remainingTime);
        } else {
          this.refreshToken().subscribe({
            next: (response) => {
              const loginResponse = response as {
                access_token: string;
              };
              this.token = loginResponse.access_token;
              localStorage.setItem(
                'token',
                JSON.stringify(loginResponse.access_token)
              );
            },
            error: () => {
              this.toastr.warning('Your session has expired');
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
              this.isLoggedIn = false;
              window.location.reload();
              this.router.navigate(['/']);
            },
          });
        }
      }
    } else {
      this.router.navigate(['/']);
    }
  }
 

  autoLogout(expirationDate: number) {
    if (this.clearTimeout) {
      clearTimeout(this.clearTimeout);
    }
    this.clearTimeout = setTimeout(() => {
      this.logout().subscribe({
        next: () => {
          this.refreshToken().subscribe({
            next: (response) => {
              const loginResponse = response as {
                access_token: string;
              };
              this.token = loginResponse.access_token;
              localStorage.setItem(
                'token',
                JSON.stringify(loginResponse.access_token)
              );
            },
            error: () => {
              this.toastr.warning('Your session has expired');
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
              this.isLoggedIn = false;
              window.location.reload();
              this.router.navigate(['/']);
            },
          });
        },
        error: (error: HttpErrorResponse) => {
          this.toastr.error(error.error.message);
        },
      });
    }, expirationDate);
  }

  getUser(accessToken: string) {
    return this.http.get(`${this.url}/auth/user-details`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    });
  }

  updateUser(updateRequest: any) {
    return this.http.put(
      `${this.url}/auth/update-user`,
      updateRequest,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  approveUser(id: string) {
    return this.http.put(
      `${this.url}/auth/approve-user/${id}`,
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  activateUser(id: string) {
    return this.http.put(
      `${this.url}/auth/activate-user/${id}`,
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  getUserById(id: string) {
    return this.http.get(`${this.url}/auth/user-id/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      }),
    });
  }

  getAllIndividu() {
    return this.http.get<Individu[]>(
      `${this.url}/auth/get-All-individu`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }

  getAllIndividuFilteredByRole(role: IndividuRole) {
    return this.http.get<Individu[]>(
      `${this.url}/auth/individus-byRole/${role}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }

  getAllIndividuFilteredByField(search: String) {
    return this.http.get<Individu[]>(
      `${this.url}/auth/individus-byFiled/${search}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }

  getAllSocieties() {
    return this.http.get<Society[]>(
      `${this.url}/auth/get-All-society`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }

  getAllSocietiesFilteredByRole(role: SocietyRole) {
    return this.http.get<Society[]>(
      `${this.url}/auth/societies-byRole/${role}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }

  getAllSocietiesFilteredByField(search: String) {
    return this.http.get<Society[]>(
      `${this.url}/auth/societies-byFiled/${search}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }

  getAllUsers() {
    return this.http.get<any[]>(`${this.url}/auth/all-users`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      }),
    });
  }

  updatePassword(updateRequest: any) {
    return this.http.put(
      `${this.url}/auth/update-password`,
      updateRequest,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  resetPassword(updateRequest: any) {
    return this.http.put(
      `${this.url}/auth/forgot-password`,
      updateRequest,
      httpOptions
    );
  }

  refreshToken() {
    return this.http.post(
      `${this.url}/auth/refreshToken`,
      {
        token: this.refresh_token,
      },
      httpOptions
    );
  }

  updateImage(formData: FormData) {
    return this.http.put(
      `${this.url}/auth/update-image`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }

  getUserImage() {
    return this.http.get(
      `${this.url}/auth/user-image`,
      {
        responseType: 'blob',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }

  getUserImageByAdmin(userId: String) {
    return this.http.get(
      `${this.url}/auth/user-image-admin/${userId}`,
      {
        responseType: 'blob',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }

  getCountUsersByRole() {
    return this.http.get(
      `${this.url}/auth/count-by-role`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }

  generateQRCode(id: string) {
    return this.http.get(
      `${this.url}/auth/generateQRCode/${id}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
        }),
      }
    );
  }
}
