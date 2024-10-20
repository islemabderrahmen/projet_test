import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Authentication } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-update-passowrd',
  templateUrl: './update-passowrd.component.html',
  styleUrls: ['./update-passowrd.component.css']
})
export class UpdatePassowrdComponent {
  updatePassword!: FormGroup;
  isLoading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private consumer: Authentication,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.updatePassword = this.formBuilder.group({
      oldPassword: ['',[Validators.required]],
      newPassword: ['',[Validators.required]],
      confirmPassword: ['',[Validators.required]],
    });
  }
  update(form: any) {
    this.isLoading = true;
      const updateRequest = {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      };
      this.consumer.updatePassword(updateRequest).subscribe({
        next: (response) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.consumer.updateLocalUser(response);
          this.toastr.success('Your account has been updated successfully');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error(error.error);
        },complete: () => {
          this.isLoading = false;
        },
      });
    }
    
}
