import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OfferService } from '../../service/offer.service';
@Component({
  selector: 'app-detail-offer',
  templateUrl: './detail-offer.component.html',
  styleUrls: ['./detail-offer.component.css']
})
export class DetailOfferComponent {
  id!:number;
  offer!:any;
  constructor(private route: ActivatedRoute,private offerS:OfferService){
  this.id=this.route.snapshot.params['id'];
  }
  ngOnInit(){

    this.offerS.getById(this.id).subscribe({next:(data)=>this.offer=data}
    );
   }
}
