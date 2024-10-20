import { Component } from '@angular/core';
import { InvoiceService } from '../../service/invoiice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-old-invoices',
  templateUrl: './old-invoices.component.html',
  styleUrls: ['./old-invoices.component.css']
})
export class OldInvoicesComponent {
  listInvoices!:any;
  iduser!:string;

  constructor(private Invoices:InvoiceService,private router:Router){}
  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {
    this.Invoices.getOldInvoices(this.iduser).subscribe(
      (data) => {
        this.listInvoices = data;
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
