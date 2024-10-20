import { Component } from '@angular/core';
import { InvoiceService } from '../../service/invoiice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-old-invoices',
  templateUrl: './my-old-invoices.component.html',
  styleUrls: ['./my-old-invoices.component.css']
})
export class MyOldInvoicesComponent {
  listInvoices!:any;
  idsociety!:string;

  constructor(private Invoices:InvoiceService,private router:Router){}
  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {
    this.Invoices.getOldInvoicesBySociety(this.idsociety).subscribe(
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
