import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Authentication } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-reset-passowrd',
  templateUrl: './reset-passowrd.component.html',
  styleUrls: ['./reset-passowrd.component.css'],
})
export class ResetPassowrdComponent {
  resetForm!: FormGroup;
  isLoading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private consumer: Authentication,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      username: ['', [Validators.required]],
    });
  }

  reset(form: any) {
    this.isLoading = true;
    this.consumer.resetPassword(form).subscribe({
      next: () => {
        this.toastr.success('An email has been sent. Check your inbox.');
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
