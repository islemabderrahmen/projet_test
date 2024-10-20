import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestSupplyService } from '../../service/requeest-supply.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css']
})
export class AddRequestComponent {
  requestForm!: FormGroup;
  minDate = new Date();
  minDatePlusValidity!: Date;

  constructor(private requests: RequestSupplyService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.requestForm = new FormGroup({
      quantity: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      date: new FormControl('', [Validators.required, this.minDateValidator.bind(this)]),
      description: new FormControl('', Validators.required),
      validity: new FormControl('', Validators.required), // Add validity field to the form
    });

    // Subscribe to validity changes to update the minDatePlusValidity value
    this.requestForm.get('validity')?.valueChanges.subscribe(value => {
      this.calculateMinDatePlusValidity(value);
    });

    // Calculate minDatePlusValidity initially with a default validity of 4 days
    this.calculateMinDatePlusValidity(4);
  }

  // Method to calculate the minimum allowed date based on the current date and validity period
  calculateMinDatePlusValidity(validity: number) {
    const validityDays = validity * 24 * 60 * 60 * 1000; // Convert validity to milliseconds
    this.minDatePlusValidity = new Date(this.minDate.getTime() + validityDays);
  }

  minDateValidator(control: FormControl): { [key: string]: any } | null {
    if (control.value && control.value < this.minDatePlusValidity) {
      return { min: true }; // Error key for invalid date (less than minDatePlusValidity)
    }
    return null;
  }

  onChangeDate(event: any) {
    const selectedDate = new Date(event.target.value);
    if (selectedDate < this.minDatePlusValidity) {
      this.requestForm.controls['date'].setErrors({ min: true });  // Set min error manually
    } else {
      this.requestForm.controls['date'].setErrors(null);  // Clear any existing errors
    }
  }

  onSubmit() {
    console.log(this.requestForm.value);
    //alert('SUCCES\n\n'+ JSON.stringify(this.requestForm.value,null,4))
  }

  reset() {
    this.requestForm.reset();
  }

  ajouter() {
    this.requests.AddRequest(this.requestForm.value).subscribe({
      next: () => {
        console.log('demande créer avec succée.');
        this.toastr.success('demande créer avec succée.'); // Success toaster notification
        this.router.navigateByUrl('/supplyrequests'); // Navigate to 'supplyrequests' route after success
      },
      error: (error) => {
        console.error('Erreur creation de demande', error);
        this.toastr.error('Erreur creation de demande', error); // Error toaster notification
        // Handle errors during request addition (e.g., display error message)
      }
    });
  }
}
