import { Component } from '@angular/core';
import {OfferService} from "../../service/offer.service"
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent {
  listOffer!:any;
  constructor(private offerS:OfferService,private route: ActivatedRoute,private router:Router){  }
    ngOnInit(): void {
      this.loadOffers();
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
    loadOffers() {
      this.offerS.getEnAttenteOffer().subscribe(
        (data) => {
          this.listOffer = data;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  
  }

