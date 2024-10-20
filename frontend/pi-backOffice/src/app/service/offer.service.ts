import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {Offer} from "../model/offer";
import { Observable } from 'rxjs';
import { Category } from '../model/category';
import { Society } from '../model/society';
import { interval } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Authentication } from './authentication.service';
@Injectable({
  providedIn: 'root'
})
export class OfferService {
  constructor(private http: HttpClient,private auth:Authentication) {}
    getOffers(){
    return this.http.get('http://localhost:8087/Offer/allOffers');
  }
  getAcceptedOffer(){
    return this.http.get('http://localhost:8087/Offer/AcceptedOffer');
  }
  getOfferOrderBy(){
    return this.http.get('http://localhost:8087/Offer/OfferOrderBy');
  }
  addFavoris(id:number){
    return this.http.post(`http://localhost:8087/Offer/favoris/${id}`,{})
  }
  getById(id:number){
    return this.http.get(`http://localhost:8087/Offer/offer/${id}`,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    })
  }
  DeleteFavoris(id:number){
    return this.http.delete(`http://localhost:8087/Offer/deleteFavoris/${id}`,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    })
  }
  DeleteOffer(id:number){
    return this.http.delete(`http://localhost:8087/Offer/deleteOffer/${id}`,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    })
  }
  AddOffer(o:Offer){
    return this.http.post(`http://localhost:8087/Offer/add-offer`,o, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    })
  }

  putProduct(id:number,o:Offer){
    return this.http.put(`http://localhost:8087/Offer/updateOffer/${id}`,o, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    })
  }
  affectOfferToSociety(o:Offer): Observable<boolean>{
        return this.http.post<boolean>('http://localhost:8087/Offer/add-offer',o, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.auth.token}`
          }),
        })
      }
  offerBySociety(){
    return this.http.get('http://localhost:8087/Offer/allOffersBySociety',{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    })
}
offerByCategory(category:Category){
  return this.http.get(`http://localhost:8087/Offer/getofferByCategory/${category}`,{
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`
    }),
  })
}
filterOffers(criteria: string) {
  return this.http.get(`http://localhost:8087/Offer/Offer/filterByCriteria/${criteria}`);
}
acceptOffer(idOffer: number): Observable<void> {
  return this.http.post<void>(`http://localhost:8087/Offer/Accept/${idOffer}`, {}, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`
    }),
  });
}

refuseOffer(idOffer: number): Observable<void> {
  return this.http.post<void>(`http://localhost:8087/Offer/Refuse/${idOffer}`, {}, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`
    }),
  });
}
getOfferCountsByCategory() {
  return this.http.get<number>('http://localhost:8087/Offer/categoryCounts', {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`
    }),
  });
}
getNbAcceptedOffer(){
  return this.http.get<number>('http://localhost:8087/Offer/nbAcceptedOffer',{
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`
    }),
  });
}
getEnAttenteOffer(){
  return this.http.get('http://localhost:8087/Offer/ListAcceptedOffer',{
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`
    }),
  });
}
startSendingOffers(): void {
  interval(86400000) // Interval d'une journée (en millisecondes)
    .pipe(
      switchMap(() => this.sendOffers())
    )
    .subscribe(response => {
      console.log('Offers sent:', response); // Afficher la réponse si nécessaire
    });
}

 sendOffers(): Observable<any> {
  return this.http.get<any>('http://localhost:8087/Offer/test-send-offers');
}

Favoris(idOffer: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.auth.token}` // Obtenez le token JWT à partir du service d'authentification
    });

    return this.http.post(`http://localhost:8087/Offer/AddFavoris/${idOffer}`, null, { headers });
  }
  getFavoriteOffers(){
    return this.http.get('http://localhost:8087/Offer/getOfferFavoris',{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }
  getCandidaturesByOffer(){
    return this.http.get('http://localhost:8087/Offer/candidatures-by-offer',{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }
  getCandidatUsers(idOffer: number): Observable<Boolean> {
    return this.http.get<any>(`http://localhost:8087/Offer/candidatByOffer/${idOffer}`,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });
  }
  predict(profile: any, offer: any, skill1: any, skill2: any): Observable<any> {
    const data = {
      profile: profile,
      offer: offer,
      skill1: skill1,
      skill2: skill2
    };
    return this.http.post<any>('http://localhost:5000/predict', data).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        throw error;
      })
    );
  }
}
