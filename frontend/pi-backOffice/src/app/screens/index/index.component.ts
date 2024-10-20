import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { ForumServiceService } from 'src/app/service/foruum-service.service';
import { OfferService } from 'src/app/service/offer.service';
import { PackServiceService } from 'src/app/service/pacck-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent {
  listOffer!: any;
  forum!: any;
  users!: any[];
  url: any;
  userImageUrl!: any;

  constructor(
    private packService: PackServiceService,
    private offerS: OfferService,
    private router: Router,
    private forumService: ForumServiceService
  ) {}
  ngOnInit(): void {
    this.url = environment.apiUrl;
    this.loadOffers();
    this.forumService
      .getCurrentForumOrLatest()
      .subscribe((data) => (this.forum = data));
    this.packService.getParticipants().subscribe((data) => {
      this.users = data;
      console.log(this.users);
    });
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
}
