import { Component } from '@angular/core';
import { RequestSupplyService } from '../../service/requeest-supply.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-request',
  templateUrl: './update-request.component.html',
  styleUrls: ['./update-request.component.css']
})
export class UpdateRequestComponent {
  id!:number;
  request:any
  updateForm!: FormGroup;
  minDate = new Date(); 
  minDatePlusFourDays!: Date;
  constructor(private fb:FormBuilder,private requesteS:RequestSupplyService,private router:Router,private route: ActivatedRoute){  
}
ngOnInit(){
  const fourDays = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
  this.minDatePlusFourDays = new Date(this.minDate.getTime() + fourDays);
  this.updateForm= new FormGroup({
    quantity:new FormControl('',Validators.required),
    category: new FormControl('', Validators.required),
    date: new FormControl('', [Validators.required, this.minDateValidator.bind(this)]),
    description: new FormControl('',Validators.required),
    validity:new FormControl('',Validators.required),

  
  });
  this.id=this.route.snapshot.params['id'];
  this.requesteS.getById(this.id).subscribe(
    (requester) => { this.request=requester;
    this.updateForm.patchValue(this.request);
  }
  );
}

minDateValidator(control: FormControl): { [key: string]: any } | null {
  if (control.value && control.value < this.minDatePlusFourDays) {
    return { min: true }; // Error key for invalid date (less than minDatePlusFourDays)
  }
  return null;
}

onChangeDate(event: any) {
  const selectedDate = new Date(event.target.value);
  if (selectedDate < this.minDatePlusFourDays) {
    this.updateForm.controls['date'].setErrors({ min: true });  // Set min error manually
  } else {
    this.updateForm.controls['date'] .setErrors(null);  // Clear any existing errors
  }
  // Alternatively, you can trigger touched state here:
  // this.requestForm.get('date').markAsTouched();
}
 reset(){
   this.updateForm.reset();
 }
 onSubmit(){
   console.log(this.updateForm.value);
 }
 update(){
   this.requesteS.putRequest(this.id,this.updateForm.value).subscribe(
     {next:()=>this.router.navigate(['/supplyrequests']),
     error:(error)=>console.log(error)}
   )

}
}
