import { Component } from '@angular/core';
import { InvoiceService } from '../../service/invoiice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {
  listInvoices!:any;
  userId!: String
  constructor(private Invoices:InvoiceService,private router:Router){}
  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices() {
    this.Invoices.getInvoices(this.userId).subscribe(
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
