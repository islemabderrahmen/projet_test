import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { Category } from 'src/app/model/category';
import { OfferService } from 'src/app/service/offer.service';
import { Authentication } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-page-offers',
  templateUrl: './page-offers.component.html',
  styleUrls: ['./page-offers.component.css']
})
export class PageOffersComponent {
  p:number = 1 ; 
  POSTS: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3,6, 9, 12];

  listOffer!:any;
  FavoriteOffer!:any;
  user!: any;
  searchCategory: Category | undefined;
  categories: string[] = Object.keys(Category).filter((key:any) => !isNaN(Number(Category[key])));
  placeholderText = "Choisissez une catégorie";
  category = new FormControl('', Validators.required)
  constructor(private offerS:OfferService,private router:Router,private sanitizer: DomSanitizer,private consumer: Authentication){
  }
  ngOnInit(): void {
    this.loadOffers();
    this.offerS.sendOffers();
    this.user=this.consumer.user  
    if (this.user) {
      this.loadFavoriteOffers(); // Charger les offres favorites de l'utilisateur connecté
    }
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
  onTableDataChange(event: any) {
    this.page = event;
    this.loadFavoriteOffers();
  }
  
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.loadFavoriteOffers();

  }
  loadFavoriteOffers() {
    // Appeler le service pour récupérer les offres favorites de l'utilisateur
    this.offerS.getFavoriteOffers().subscribe(
      (data) => {
        this.FavoriteOffer = data;
  },
      (error) => {
        console.log(error);
      }
    );
  }
  deleteFavoris(id:number) {
    // Appeler le service pour récupérer les offres favorites de l'utilisateur
    this.offerS.DeleteFavoris(id).subscribe(
      (data) => {
        this.FavoriteOffer = data;
        this.loadFavoriteOffers();
        this.loadOffers();
  },
      (error) => {
        console.log(error);
      }
    );
  }
  
  loadOffers() {
    this.offerS.getAcceptedOffer().subscribe(
        (data) => {
            this.listOffer = data;
            // Loop through the offers to update the image URLs
            this.listOffer.forEach((offer: any) => {
                // Decode the file name from base64
                const decodedBase64 = atob(offer.file);

                // Remove the path from the file name using a regular expression
                const fileNameWithoutPath = decodedBase64.replace(/^.*[\\/]/, '');

                // Construct the relative path to the image file in your Angular application
                offer.file = `../assets/img/${fileNameWithoutPath}`;
            });
        },
        (error) => {
            console.log(error);
        }
    );
}
  truncateDescription(text: string, maxLength: number, showFullDescription: boolean): string {
    if (showFullDescription) {
      return text; // Return full description if showFullDescription is true
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
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
      this.loadFavoriteOffers();
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
  showFullDescription(offer: any): void {
    // Toggle the showFullDescriptionFlag for the clicked offer
    offer.showFullDescriptionFlag = !offer.showFullDescriptionFlag;
  }
  filterOffers(criteria:string): void {
    this.offerS.filterOffers(criteria).subscribe(
      (data) => {
        this.listOffer = data;
            // Loop through the offers to update the image URLs
            this.listOffer.forEach((offer: any) => {
                // Decode the file name from base64
                const decodedBase64 = atob(offer.file);

                // Remove the path from the file name using a regular expression
                const fileNameWithoutPath = decodedBase64.replace(/^.*[\\/]/, '');

                // Construct the relative path to the image file in your Angular application
                offer.file = `../assets/img/${fileNameWithoutPath}`;
            });
        },
        (error) => {
            console.log(error);
        }
    );
  }
}
