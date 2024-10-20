import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PackServiceService } from 'src/app/service/pacck-service.service';
import { StandServiceService } from 'src/app/service/stannd-service.service';
import { Pack } from 'src/app/model/pack';
import { Stand } from 'src/app/model/stand';

@Component({
  selector: 'app-personalized-pack',
  templateUrl: './personalized-pack.component.html',
  styleUrls: ['./personalized-pack.component.css']
})
export class PersonalizedPackComponent  implements OnInit {

  packForm !: FormGroup;
  stands : Stand[]=[];
  pack :any = {
    numberOfOffers: 0,
    numberOfBadges: 0,
    numberOfFlyers: 0,
    displayLogo: true,
    insertFlyer: true,
  }; 
  currentId!: any;
  currentAction !: String; 
  selectedStand !: any;
  constructor(private fb: FormBuilder, private packService: PackServiceService, private router: Router, 
    private standService:StandServiceService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    this.standService.getStandByStatut(false).subscribe((data)=>{
      this.stands = data;
    
    }) 
  }

  initForm(): void {
    this.packForm = new FormGroup({
      numberOfOffers:  new FormControl ('',[Validators.required]),
      numberOfBadges:  new FormControl ('',[Validators.required]),
      numberOfFlyers:  new FormControl ('',[Validators.required]),
      stand :  new FormControl ('',[Validators.required]),
      displayLogo:  new FormControl (false,[Validators.required]),
      insertFlyer:  new FormControl (false,[Validators.required])
    });
  }

  onSubmit(): void {
     this.pack.numberOfOffers = this.packForm.get('numberOfOffers')?.value
     this.pack.numberOfBadges = this.packForm.get('numberOfBadges')?.value
     this.pack.numberOfFlyers = this.packForm.get('numberOfFlyers')?.value
     this.pack.insertFlyer = this.packForm.get('insertFlyer')?.value
     this.pack.displayLogo = this.packForm.get('displayLogo')?.value
     // Recherche du stand correspondant au numéro sélectionné dans le formulaire
    const number = this.packForm.get('stand')?.value;
    this.stands.forEach(stand => {
    if(stand.number == number){
    this.selectedStand = stand.id;
    }
   });
   console.log(this.pack);
   
     this.packService.createPersonalizedPack(this.selectedStand,this.pack).subscribe({
      next: () => {
        console.log(this.pack);
        this.toastr.success('La demande  a été enregistré avec succés');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  

  }}