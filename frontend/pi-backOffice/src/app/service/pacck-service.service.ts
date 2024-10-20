
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Pack } from '../model/pack';
import { Authentication } from './authentication.service';
import { User } from '../model/user';


@Injectable({
  providedIn:'root'
})
export class PackServiceService {
 
 

  apiURL: string = 'http://localhost:8087/pack';
  
  constructor(private router: Router, private http: HttpClient, private auth : Authentication ) { }

  listpack(): Observable<Pack[]>{
    const url = `${this.apiURL}/find-all-packs`;
    return this.http.get<Pack[]>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  public findListOfParticipants(): Observable<User[]> {
    const url = `${this.apiURL}/getListOfParticipants`;
    return this.http.get<User[]>(url,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
        'Content-Type': 'application/json',
      }),
    });
  }
  calculatePackIncomes(): Observable<any> {
    const url = `${this.apiURL}/getPacksStatistics`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }


  getParticipants(): Observable<any[]> {
    const url = `${this.apiURL}/getListOfParticipants`;
    return this.http.get<any[]>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }


  getpackByTypePack(TypePack: string, reservationStatus : string): Observable<Pack[]> {
    const url = `${this.apiURL}/find-pack-By-typePack-reservationStatus/${TypePack}/${reservationStatus}`;
    return this.http.get<Pack[]>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  getpackById(id: number): Observable<Pack> {
    const url = `${this.apiURL}/find-pack/${id}`;
    return this.http.get<Pack>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }
  getCurrentpack():Observable<Pack>{
    return this.http.get<Pack>(this.apiURL, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }
  addpack(pack: Pack, id : number): Observable<Pack> {
    const url = `${this.apiURL}/create_Pack_And_Assign_To_Stand/${id}`;
    return this.http.post<Pack>(url, pack, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  createPersonalizedPack(standId : number, pack : Pack): Observable<Pack> {
    console.log(standId);
    console.log(pack);
    const url = `${this.apiURL}/createPersonalizedPackPrice/${standId}`;
    console.log(url);
    return this.http.post<Pack>(url, pack, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  updatepack(id:Number,pack: Pack) {
    const url = `${this.apiURL}/update-pack/${id}`;
    return this.http.put<Pack>(url, pack, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }
  deletepack(id: number) {
    const url = `${this.apiURL}/delete-pack/${id}`;
    return this.http.delete(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  bookPack(id: number) {
    const url = `${this.apiURL}/book_Pack/${id}`;
    return this.http.put(url,{}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

 

  validateReservation(idPack: number) {
    const url = `${this.apiURL}/validate_Reservation/${idPack}`;
    return this.http.put(url,{}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }

  cancelReservation(idPack: number) {
    const url = `${this.apiURL}/cancel_Reservation/${idPack}`;
    return this.http.put(url,{}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }
}
