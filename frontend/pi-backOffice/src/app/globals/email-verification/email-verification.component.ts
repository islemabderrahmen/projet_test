import { Component } from '@angular/core';
import { Authentication } from '../../service/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css'],
})
export class EmailVerificationComponent {
  constructor(
    private consumer: Authentication,
    private toastr: ToastrService
  ) {}

  emailVerification() {
    this.consumer.emailVerification().subscribe({
      next: (response) => {
        const messageResponse = response as {
          message: string;
        };
        this.toastr.success(messageResponse.message);
        console.log(messageResponse.message);
      },
      error: (error) => {
        this.toastr.error(error.message);
        console.error(error.error.message);
      },
    });
  }
}
