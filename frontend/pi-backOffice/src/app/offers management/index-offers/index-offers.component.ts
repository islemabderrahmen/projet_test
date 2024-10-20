import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from 'src/app/service/authentication.service';
import { OfferService } from 'src/app/service/offer.service';

@Component({
  selector: 'app-index-offers',
  templateUrl: './index-offers.component.html',
  styleUrls: ['./index-offers.component.css']
})
export class IndexOffersComponent {
  listOffer!:any;
  user!: any;
  constructor(private offerS:OfferService,private router:Router,private consumer: Authentication){}
  ngOnInit(): void {
    this.loadOffers();
    this.user=this.consumer.user  }
  truncateDescription(text: string, maxLength: number, showFullDescription: boolean): string {
    if (showFullDescription) {
      return text; // Return full description if showFullDescription is true
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }
  showFullDescription(offer: any): void {
    // Toggle the showFullDescriptionFlag for the clicked offer
    offer.showFullDescriptionFlag = !offer.showFullDescriptionFlag;
  }
  getCandidatOffer(idOffer: number) {
    if (this.user){
    this.offerS.getCandidatUsers(idOffer)
      .subscribe(result => {
        if (result==true) {
          alert('Vous avez déjà postulé à cette offre.');
         } else 
          {
              this.router.navigate(['/postuler', idOffer]);
            } 
          }
      , (error: any) => {
        // Handle errors here
        console.error('Error fetching candidat result:', error);
      });
    }
    else {
      // Handle case where user is not logged in
      this.router.navigate(['/signIn']); // Redirect to login page
      // OR: Show an alert to prompt the user to login
      // alert('Please login to apply for this offer.');
    }
  }
  
  
  loadOffers() {
    this.offerS.getAcceptedOffer().subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          // Filtrer les offres avec un nombre de favoris supérieur à 3
          this.listOffer = data;
        } else {
          console.log("Les données ne sont pas au format de tableau.");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  addFavoris(id:number){
    this.offerS.addFavoris(id).subscribe((data) => {
      this.loadOffers();
    },
    (error) => {
      console.log(error);
    }
  );
}
Favoris(id: number) {
  if (this.user) { // Vérifier si l'utilisateur est connecté
    this.offerS.Favoris(id).subscribe((data) => {
      this.loadOffers();
    },
    (error) => {
      console.log(error);
    });
  } else {
    // Rediriger l'utilisateur vers la page de connexion
    this.router.navigate(['/signIn']);
  }
}

hasOffersWithMoreThanThreeFavorites(): boolean {
  // Parcourez la liste des offres et vérifiez si au moins une offre a un nombre de favoris supérieur à 3
  for (const offer of this.listOffer) {
    if (offer.favoris > 3) {
      return true;
    }
  }
  return false;
}
}