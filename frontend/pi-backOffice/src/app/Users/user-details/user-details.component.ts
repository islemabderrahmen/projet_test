import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Authentication } from '../../service/authentication.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent {
  constructor(
    private consumer: Authentication,
    private route: ActivatedRoute
  ) {}
  userId!: string;
  user!: any;
  userImage!: any;
  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.consumer
      .getUserById(this.userId)
      .subscribe((response) => (this.user = response));
      this.getUserImage();
  }

  getUserImage() {
    this.consumer.getUserImageByAdmin(this.userId).subscribe({
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
