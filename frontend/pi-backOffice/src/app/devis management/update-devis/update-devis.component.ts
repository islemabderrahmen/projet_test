import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DeviisService } from '../../service/deviis.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-devis',
  templateUrl: './update-devis.component.html',
  styleUrls: ['./update-devis.component.css']
})
export class UpdateDevisComponent {
  id!:number;
  devis:any
  updateFormD!: FormGroup;
  constructor(private fb:FormBuilder,private devisS:DeviisService,private router:Router,private route: ActivatedRoute){  
}
ngOnInit(){
  this.updateFormD= new FormGroup({
    file:new FormControl('',Validators.required),
    description: new FormControl('', Validators.required),
    price:new FormControl('',Validators.required),
    quantity:new FormControl('',Validators.required),

  });
  this.id=this.route.snapshot.params['id'];
  this.devisS.getById(this.id).subscribe(
    (devisr) => { this.devis=devisr;
    this.updateFormD.patchValue(this.devis);
  }
  );
}
 reset(){
   this.updateFormD.reset();
 }
 onSubmit(){
   console.log(this.updateFormD.value);
 }
 update(){
   this.devisS.putDevis(this.id,this.updateFormD.value).subscribe(
     {next:()=>this.router.navigate(['/devis']),
     error:(error)=>console.log(error)}
   )
}
}
