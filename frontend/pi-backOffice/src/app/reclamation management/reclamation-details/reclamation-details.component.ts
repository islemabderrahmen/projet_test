import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Authentication } from 'src/app/service/authentication.service';
import { ReclamationService } from 'src/app/service/reclamation.service';

@Component({
  selector: 'app-reclamation-details',
  templateUrl: './reclamation-details.component.html',
  styleUrls: ['./reclamation-details.component.css'],
})
export class ReclamationDetailsComponent {
  constructor(
    private consumer: ReclamationService,
    private auth: Authentication,
    private route: ActivatedRoute
  ) {}
  reclamationId!: number;
  reclamation!: any;
  userImage!: string;
  ngOnInit() {
    this.reclamationId = this.route.snapshot.params['id'];
    this.consumer.getReclamationsById(this.reclamationId).subscribe((data) => {
      console.log(data)
      this.reclamation = data;
      this.getUserImage(this.reclamation?.user?.id);
    });
    
  }

  getUserImage(userId: string) {
    this.auth.getUserImageByAdmin(userId).subscribe({
      next: (response) => {
        this.userImage = URL.createObjectURL(response);
        console.log(this.userImage);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
