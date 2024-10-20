import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { Authentication } from 'src/app/service/authentication.service';
import { ReclamationService } from 'src/app/service/reclamation.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  constructor(
    private reclamationService: ReclamationService,
    private auth : Authentication,
    
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  users : any[]=[];
  nom !: String;
  listFilter!: FormGroup;
  ngOnInit(): void {
    
    this.listFilter = this.formBuilder.group({
      message: [''],
    });
    
  }
  Contact(email : String,form:FormGroup){
    this.reclamationService
    .Contact(email,form.get('message')!.value)
    .subscribe({
      next: () => {
        
        this.toastr.success('You have sent an email successfully');
        
      },
      error: (error: any) => {
        this.toastr.error(error.error.message);
      },
    });
  }
}
