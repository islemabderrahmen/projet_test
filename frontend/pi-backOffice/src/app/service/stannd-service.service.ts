import { Status } from '../model/status';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Stand } from '../model/stand';
import { Authentication } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class StandServiceService {

  apiURL: string = 'http://localhost:8087/stand';
  
  constructor(private router: Router, private http: HttpClient,  private auth: Authentication ) { }

  listStand(): Observable<Stand[]>{
    const url = `${this.apiURL}/find-all-stands`;
    return this.http.get<Stand[]>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  getStandById(id: number): Observable<Stand> {
    const url = `${this.apiURL}/find-stand/${id}`;
    return this.http.get<Stand>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  getCurrentStand():Observable<Stand>{
    return this.http.get<Stand>(this.apiURL, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  addStand(Stand: Stand): Observable<Stand> {

    const url = `${this.apiURL}/add-stand`;
    return this.http.post<Stand>(url, Stand, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  updateStand(Stand: Stand,id:Number) {
    const url = `${this.apiURL}/update-stand/${id}`;
    return this.http.put<Stand>(url, Stand, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }
  getStandByStatut(Status: boolean){
    const url = `${this.apiURL}/find-stand-By-Status/${Status}`;
    return this.http.get<Stand[]>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  deleteStand(id: number) {
    const url = `${this.apiURL}/delete-stand/${id}`;
    return this.http.delete(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

}
