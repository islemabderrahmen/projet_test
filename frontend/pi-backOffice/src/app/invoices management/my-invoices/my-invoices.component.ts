import { Component } from '@angular/core';
import { InvoiceService } from '../../service/invoiice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-invoices',
  templateUrl: './my-invoices.component.html',
  styleUrls: ['./my-invoices.component.css']
})
export class MyInvoicesComponent {
  listInvoices!:any;
  idsociety!:string;

  constructor(private Invoices:InvoiceService,private router:Router){}
  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {
    this.Invoices.getInvoicesBySociety(this.idsociety).subscribe(
      (data) => {
        this.listInvoices = data;
        console.log(this.listInvoices);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  viewFile(fileName: string) {
    const fileUrl = this.Invoices.getFileUrl(fileName);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  }
  
}
