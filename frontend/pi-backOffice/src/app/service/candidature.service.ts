import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidature } from '../model/candidature';
import { Authentication } from './authentication.service';
import { Interview } from '../model/interview';
@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private baseUrl = "http://localhost:8087/candidat";
  private baseUrl1 = "http://localhost:8087/interview";
  private baseUrl2 = "http://localhost:8087/room";
  constructor(private http: HttpClient,private auth:Authentication) {
   }
  getData(id:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidatbyoffer/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
  }
  getDataCandidat(): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidatbyuser`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
  }
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  downloadCv(candidateId: number) {
    this.fetchBlob(this.baseUrl + '/download-cv/' + candidateId)
      .subscribe(cvBlob => {
        const url = window.URL.createObjectURL(cvBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cv.pdf'; // Adjust filename as needed
        link.click();
        link.remove();
      }, error => {
        console.error('Error downloading CV:', error);
        // Handle download errors (explained below)
      });
  }
  downloadLettre(candidateId: number) {
    this.fetchBlob(this.baseUrl + '/download-lettre/' + candidateId)
      .subscribe(lettreBlob => {
        const url = window.URL.createObjectURL(lettreBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'lettre.pdf'; // Adjust filename as needed
        link.click();
        link.remove();
      }, error => {
        console.error('Error downloading Lettre:', error);
        // Handle download errors (explained below)
      });
  }
  
  private fetchBlob(url: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`, // Add authorization header
      Accept: 'application/octet-stream' // Set appropriate header for PDF download
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }
  
  addCandidat(id: number, formData: FormData): Observable<Candidature> { // Specify return type
    const url = `${this.baseUrl}/addcandidat/${id}`; // Replace with actual URL
    return this.http.post<Candidature>(url, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });    
  }
  
  getRooms(): Observable<any> {
    return this.http.get(`${this.baseUrl2}/allrooms`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
  }
  getInterview(): Observable<any> {
    return this.http.get(`${this.baseUrl1}/allInterview`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
  }
  
  updateCandidature(id: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateCandidat/${id}`, updatedData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
  }
  accepterCandidature(id: number): Observable<Candidature> {
    const url = `${this.baseUrl}/accepterCandidat/${id}`;
    return this.http.put<Candidature>(url, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
  }
  refuserCandidature(id: number): Observable<Candidature> {
    const url = `${this.baseUrl}/refuserCandidat/${id}`;
    return this.http.put<Candidature>(url, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
  }
  getNewCandidaturesCount(): Observable<number> {
    const url = `${this.baseUrl}/new-count`;
    return this.http.get<number>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      })
    });
  }
  
  accepterI(id: number): Observable<Interview> {
    const url = `${this.baseUrl1}/valider/${id}`;
    return this.http.put<Interview>(url, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
  }
  updateInterview(id:number, updatedI: any):Observable<any>{
    return this.http.put(`${this.baseUrl1}/updateI/${id}`, updatedI, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });

  }
  
  getById(id:number): Observable<any>{
     return this.http.get(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
  }

  getByIdInterview(id:number): Observable<any>{
    return this.http.get(`${this.baseUrl1}/${id}`, {
     headers: new HttpHeaders({
       Authorization: `Bearer ${this.auth.token}`,
     }),
   });
 }
  delete(id:number): Observable<any>{
    return this.http.delete(`${this.baseUrl1}/deleteI/${id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
 }
 getInterviewsByEtat(etat: string,id:number ): Observable<Interview[]> {
  const url = `${this.baseUrl1}/byEtatAndOffer/${etat}/${id}`; // Construct the URL for the API endpoint
  return this.http.get<Interview[]>(url, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`
    })
  });
}

  addInterview(url: string, interview: any): Observable<any> {
    return this.http.post(url, interview , {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
    });
  }

  getOfferDates(): Observable<Date[]> {
    const url = 'http://localhost:8087/Offer/dates'; 
    return this.http.get<Date[]>(url);
  }
  hasUserAppliedToOffer(offerId: number): Observable<boolean> {
    const url = `${this.baseUrl}/check/${offerId}`; // Assurez-vous que `this.baseUrl` est correctement défini
    return this.http.get<boolean>(url, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
        'Content-Type': 'application/json'
      })
    });
  }
  addI(url: string, interview: any): Observable<Interview> { 
    return this.http.post<Interview>(url, interview, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });    
  }
  updateInterviewR(url: string, interview: any):Observable<Interview>{
    return this.http.put<Interview>(url, interview, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`
      }),
    });  

  }
}