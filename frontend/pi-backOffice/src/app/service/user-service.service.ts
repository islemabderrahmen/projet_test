import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sponsor } from '../model/sponsor';
import { Observable } from 'rxjs';
import { Authentication } from './authentication.service';

@Injectable()
export class UserService {

  private usersUrl: string;

  constructor(private http: HttpClient,private auth:Authentication) {
    this.usersUrl = 'http://localhost:8087/api/sponsors';
  }

  public findAll(): Observable<Sponsor[]> {
    return this.http.get<Sponsor[]>(this.usersUrl,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
        'Content-Type': 'application/json',
      }),
    });
  }

  public save(user: Sponsor) {
    return this.http.post<Sponsor>(this.usersUrl, user, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
        'Content-Type': 'application/json',
      }),
    });
  }
  deleteSponsor(idSponsor: number): Observable<void> {
    const url = `${this.usersUrl}/${idSponsor}`;
    return this.http.delete<void>(url,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
        'Content-Type': 'application/json',
      }),
    });
  }
  


  public findSponsorById(id: number): Observable<Sponsor> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<Sponsor>(url,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
        'Content-Type': 'application/json',
      }),
    });
  }


  public updateSponsor(sponsor: Sponsor): Observable<Sponsor> {
    const url = `${this.usersUrl}/${sponsor.idSponsor}`;
    return this.http.put<Sponsor>(url, sponsor, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
        'Content-Type': 'application/json',
      }),
    });
  }


// Dans votre service Angular (UserService)
public recordSponsorView(sponsorId: number): Observable<any> {
  const url = `${this.usersUrl}/${sponsorId}/details`;
  return this.http.get(url, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.auth.token}` // Assurez-vous d'ajouter votre jeton d'authentification si nécessaire
    })
  });
}

// Ajoutez cette méthode dans votre classe UserService

public getMostViewedSponsor(): Observable<Sponsor> {
  return this.http.get<Sponsor>(`${this.usersUrl}/most-viewed`, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.token}` // Assurez-vous d'ajouter votre jeton d'authentification si nécessaire
    })
  });
}




  makeCall(phoneNumber: string): Observable<any> {
    // Implémentez ici la logique pour initier l'appel avec le numéro de téléphone donné
    // Par exemple, vous pouvez appeler une API qui gère les appels
    // Assurez-vous d'adapter cette méthode à votre propre logique de gestion des appels
    console.log(`Initiating call to ${phoneNumber}...`);
    // Retournez un observable pour gérer la réponse de l'appel
    return this.http.post<any>('http://example.com/make-call', { phoneNumber });
  }






  processPayment(token: string, amount: number, currency: string) {
    const paymentData = {
      token: token,
      amount: amount,
      currency: currency
    };
    return this.http.post('/api/payment/process', paymentData);
  }



}