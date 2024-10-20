import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../service/invoiice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent {
  invoiceForm!: FormGroup;
  requestId!: number; 
  selectedFile: File | undefined;


  constructor(private Invoices:InvoiceService,private router:Router,private route:ActivatedRoute, private toastr: ToastrService){}
  ngOnInit() {
    this.invoiceForm = new FormGroup({
      file: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  
    const params = this.route.snapshot.params;
    if (params['requestId']) {
      this.requestId = +params['requestId'];
    } else {
      console.error('Missing requestId in route parameters');
      // Handle missing requestId (e.g., redirect, display error message)
    }
  
  }
  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }
  onSubmit(){
    console.log(this.invoiceForm.value);
    //alert('SUCCES\n\n'+ JSON.stringify(this.invoiceForm.value,null,4))
  }
  reset(){
    this.invoiceForm.reset();
  }

  
  ajouter() {
      if (this.invoiceForm.valid) {
          const invoiceData = {
              description: this.invoiceForm.get('description')?.value,
          };
  
          const formData = new FormData();
          formData.append('invoice', JSON.stringify(invoiceData));
          formData.append('file', this.selectedFile!, this.selectedFile!.name);
  
          this.Invoices.addAndAssignInvoiceToRequest(this.invoiceForm.value, this.requestId, formData).subscribe({
              next: () => {
                  console.log('facture créer avec succée');
                  this.toastr.success('facture créer avec succée'); // Success toaster notification
                  this.router.navigateByUrl('/my-invoices'); // Navigate to 'invoices' route after success
              },
              error: (error) => {
                  console.error('erreur creation de facture:', error);
                  this.toastr.error('erreur creation de facture:', error); // Error toaster notification
                  // Handle errors during invoice addition (e.g., display error message)
              }
          });
      } else {
          console.error('form facture invalid!');
          this.toastr.error('form facture invalid!'); // Invalid form toaster notification
      }
  }
  
}
