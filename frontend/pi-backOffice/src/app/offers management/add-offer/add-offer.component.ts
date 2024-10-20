import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import {OfferService} from "../../service/offer.service"
import {Offer} from "../../model/offer"
import { Category } from '../../model/category';
@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.css']
})
export class AddOfferComponent {
  registerForm!: any;
  categoryOptions: string[] = Object.keys(Category).filter((key:any) => !isNaN(Number(Category[key])));
  predictedNumber: number | null = null;
  fileBase64: string | ArrayBuffer | null = null;

  constructor(private offerS:OfferService,private router:Router){}
  ngOnInit(){
    this.registerForm= new FormGroup({
      offerName:new FormControl('',Validators.required),
      offreCategory: new FormControl('', Validators.required),
      candidatnumber: new FormControl(''),
      candidatProfil: new FormControl('',Validators.required),
      duree:new FormControl('',Validators.required),
      description:new FormControl('',Validators.required),
      file:new FormControl(''),
      date1:new FormControl('',Validators.required),
      date2:new FormControl('',Validators.required),
      date3:new FormControl('',Validators.required)

    });

  }

  
  onSubmit(){
    console.log(this.registerForm.value);
    alert('SUCCES\n\n'+ JSON.stringify(this.registerForm.value,null,4))
  }
  reset(){
    this.registerForm.reset();
  }
  showFileUpload: boolean = false;

  // Méthode pour changer la valeur de showFileUpload
  toggleFileUpload(): void {
    this.showFileUpload = !this.showFileUpload; // Inverse la valeur actuelle
  }
    // Check if registerForm is null
    ajouter() {
      // Check if registerForm is null
      if (this.registerForm) {
        this.predict();
        const fileBase64: string | null = this.registerForm.get('file').value;
        this.registerForm.patchValue({
          fileBase64: fileBase64
        });
    
        // Subscribe to the affectOfferToSociety method
        this.offerS.affectOfferToSociety(this.registerForm.value).subscribe({
          next: () => {
            // Offer added successfully, navigate to the offerBySociety page
            this.router.navigateByUrl('/offerBySociety');
          },
          error: (error) => {
            if (error.status === 404) {
              // No forum in progress found, show an alert
              alert("Aucun forum en cours trouvé pour affecter l'offre");
            } else if (error.status === 409) {
              // The offer limit is reached, show an alert
              alert("Saturé: vous ne pouvez plus ajouter d'offre");
              this.router.navigateByUrl('/offerBySociety');
            } else if (error.status === 400) {
              // The user is not a Society, show an alert
              alert("La société n'est pas un utilisateur");
            } else {
              // Log the error if it occurs
              console.error('Error adding offer:', error);
            }
          }
        });
      } else {
        // Handle case where registerForm is null
        console.error("Register form is null.");
      }
    }
    predict(): void {
      // Extract necessary data for prediction
      const profile = this.registerForm.get('candidatProfil').value;
      const offer = this.registerForm.get('offreCategory').value;
      const skill1 = 'JavaScript'; // Extract skill1 from the form
      const skill2 = 'No SQL'; // Extract skill2 from the form
  
      // Call the predict method from PredictionService
      this.offerS.predict(profile, offer, skill1, skill2).subscribe({
        next: (prediction) => {
          console.log('Prediction:', prediction);
          this.predictedNumber = prediction.prediction; // Set predicted number

          // Do something with the prediction
        },
        error: (error) => {
          console.error('Error predicting:', error);
          // Handle error if necessary
        }
      });
    }
    
    
  
}
