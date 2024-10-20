import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../service/invoiice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-invoice',
  templateUrl: './update-invoice.component.html',
  styleUrls: ['./update-invoice.component.css']
})
export class UpdateInvoiceComponent {
  id!:number;
  invoice:any
  updateForm!: FormGroup;
  constructor(private fb:FormBuilder,private invoiceS:InvoiceService,private router:Router,private route: ActivatedRoute){  
}
ngOnInit(){
  this.updateForm= new FormGroup({
    status:new FormControl('',Validators.required),
      comment: new FormControl('', Validators.required),

  });
  this.id=this.route.snapshot.params['id'];
  this.invoiceS.getById(this.id).subscribe(
    (invoicer) => { this.invoice=invoicer;
    this.updateForm.patchValue(this.invoice);
  }
  );
}
 reset(){
   this.updateForm.reset();
 }
 onSubmit(){
   console.log(this.updateForm.value);
 }
 update(){
   this.invoiceS.putInvoice(this.id,this.updateForm.value).subscribe(
     {next:()=>this.router.navigate(['/invoices']),
     error:(error)=>console.log(error)}
   )

}
}
