import { StandServiceService } from '../../service/stannd-service.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PackServiceService } from 'src/app/service/pacck-service.service';
import { Pack } from 'src/app/model/pack';
import { Stand } from 'src/app/model/stand';

@Component({
  selector: 'app-add-pack',
  templateUrl: './add-pack.component.html',
  styleUrls: ['./add-pack.component.css']
})
export class AddPackComponent {

  addPackForm!: FormGroup;
  zones: string[] = [];
  stands : Stand[]=[];
  pack :any = {
    typePack: '',
    prix: 0,
  };
  isLoading: boolean = false;
  id !: any ; 
  constructor(private route: ActivatedRoute, private packService: PackServiceService, private router: Router, 
              private standService:StandServiceService, private toastr: ToastrService) {}
  ngOnInit() {
    this.standService.getStandByStatut(false).subscribe((data)=>{
      console.log(data)
      this.stands = data;
    })
    this.addPackForm = new FormGroup({
      typePack: new FormControl(null, [Validators.required]), 
      prix: new FormControl(0, [Validators.required, Validators.min(0),Validators.max(10000)]),
      stand : new FormControl(null, [Validators.required])
    });
  }

  onSubmit() { 
    this.pack.typePack = this.addPackForm.get('typePack')?.value;
    this.pack.prix = this.addPackForm.get('prix')?.value; 
    const number = this.addPackForm.get('stand')?.value;
    
    this.stands.forEach(stand => {
    if(stand.number == number){
      this.id = stand.id;
    }
    });
    console.log(this.pack);
    
    this.packService.addpack(this.pack,this.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('Le pack a été ajouté avec succes');
        this.router.navigate(['/packList']);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error(error.error.message);
      },
    });
  }
}


 


