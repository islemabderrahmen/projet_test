import { Component } from '@angular/core';
import { OfferService } from "../../service/offer.service";
import { Offer } from '../../model/offer';
import { Router } from '@angular/router';
import { Category } from '../../model/category';




@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
})
export class OffersComponent {
  listOffer!:any;
  searchCategory: Category | undefined;
  categories: string[] = Object.keys(Category).filter((key:any) => !isNaN(Number(Category[key])));
  Society!:any;
  placeholderText = "Choisissez une catégorie";

  constructor(private offerS: OfferService, private router: Router) { }

  ngOnInit(): void {
    this.loadOffers();
  }

  searchApartments(): void {
    if (!this.searchCategory) {
      alert("Veuillez sélectionner une catégorie");
      return;
    }
    this.offerS.offerByCategory(this.searchCategory).subscribe(
      (data) => {
        this.listOffer = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadOffers() {
    this.offerS.getOffers().subscribe(
      (data) => {
        this.listOffer = data;
        
      },
      (error) => {
        console.log(error);
      }
    );
  }
  acceptOffer(idOffer: number): void {
    this.offerS.acceptOffer(idOffer).subscribe(() => {
      alert('Offer accepted successfully');
      this.loadOffers();
      // Optionally, you can handle success response here
    }, error => {
      console.error('Error accepting offer:', error);
      // Optionally, you can handle error response here
    });
  }

  refuseOffer(idOffer: number): void {
    this.offerS.refuseOffer(idOffer).subscribe(() => {
      alert('Offer refused successfully');
      this.loadOffers();
      // Optionally, you can handle success response here
    }, error => {
      console.error('Error refusing offer:', error);
      // Optionally, you can handle error response here
    });
  }
}
