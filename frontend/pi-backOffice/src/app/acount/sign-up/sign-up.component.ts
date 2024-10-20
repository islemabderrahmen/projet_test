import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Authentication } from '../../service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IndividuRole } from '../../model/individusRole';
import { SocietyRole } from '../../model/societyRole';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  signUpForm!: FormGroup;
  isLoading: boolean = false;
  individuRole: IndividuRole[] = Object.values(IndividuRole).filter((role) => {
    return (
      role !== IndividuRole.Admin &&
      role !== IndividuRole.Community &&
      role !== IndividuRole.FinancialDirection
    );
  });

  societyRole: SocietyRole[] = Object.values(SocietyRole);
  roles: (IndividuRole | SocietyRole)[] = [
    ...this.individuRole,
    ...this.societyRole,
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private consumer: Authentication,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]],

      representative: [''],
      adresse: [''],
      matricule: [''],
      logo: [''],
      sector: [''],

      identity: [''],
      firstName: [''],
      lastName: [''],
    });
  }

  register(form: FormGroup) {
    this.isLoading = true;
    let form2: any = {};
    form2.username = form.get('username')!.value;
    form2.email = form.get('email')!.value;
    form2.password = form.get('password')!.value;
    form2.role = form.get('role')!.value;
    if (
      form.get('role')!.value &&
      this.individuRole.includes(form.get('role')!.value)
    ) {
      form2.identity = form.get('identity')!.value;
      form2.firstName = form.get('firstName')!.value;
      form2.lastName = form.get('lastName')!.value;
    } else {
      form2.matricule = form.get('matricule')!.value;
      form2.adresse = form.get('adresse')!.value;
      form2.representative = form.get('representative')!.value;
      form2.sector = form.get('sector')!.value;
    }
    this.consumer.register(form2).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('Your account has been created successfully');
        this.router.navigate(['/signIn']);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error(error.error.message);
        console.error(error);
      },
    });
  }
}
