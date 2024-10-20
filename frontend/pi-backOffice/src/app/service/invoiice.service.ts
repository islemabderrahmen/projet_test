import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Invoice } from '../model/invoice';
import { InvoiceStatus } from '../model/InvoiceStatus';
import { Authentication } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(private http:HttpClient,private auth:Authentication) { }

  getInvoices(userId: String){
    return this.http.get('http://localhost:8087/invoice/retrieveAllInvoices',{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      })
    });
  }
  getOldInvoices(userId: String){
    return this.http.get('http://localhost:8087/invoice/retrieveOldInvoices',{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      })
    });
  }
  DeleteInvoice(id:number){
    return this.http.delete(`http://localhost:8087/invoice/deleteInvoice/${id}`,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      })
    });
  }
  AddInvoice(r:Invoice){
    return this.http.post(`http://localhost:8087/invoice/addInvoice`,r,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      })
    })
  }
  getById(id:number){
    return this.http.get(`http://localhost:8087/invoice/getInvoice/${id}`,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      })
    });
  }
  putInvoice(id: number, o: Invoice) {
    return this.http.put(`http://localhost:8087/invoice/updateInvoice/${id}`, o, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      })
    });
  }
  
  addAndAssignInvoiceToRequest(invoice: Invoice, requestSupplyId: number,formData: FormData) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`,
    });
    return this.http.post(`http://localhost:8087/invoice/assignToRequest/${requestSupplyId}` ,formData , { headers });
  }
  
  getInvoicesBySociety(societyId: String) {
    return this.http.get(`http://localhost:8087/invoice/getInvoicesBySociety`,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      })
    });
  }
  getOldInvoicesBySociety(societyId: String) {
    return this.http.get(`http://localhost:8087/invoice/getOldInvoicesBySociety`,{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      })
    });
  }

  getFileUrl(fileName: string): string {
    // Assuming your backend endpoint for serving files is '/devis/file'
    return `http://localhost:8087/invoice/file/${fileName}`;
  }

  getFileContent(fileName: string) {
    const url = `http://localhost:8087/invoice/file/${fileName}`;
    return this.http.get(url, {
      responseType: 'text' // Ensure response is treated as text (Base64)git checkout 
    });
  }
  // Calculate the total amount of money for accepted devis by each individu
  calculateTotalAmountByIndividu(id:String) {
    return this.http.get('http://localhost:8087/invoice/calculateTotalAmountByIndividu', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      })
    });
  }

  
  
}