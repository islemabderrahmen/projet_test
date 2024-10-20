import { StandServiceService } from '../../service/stannd-service.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-stand',
  templateUrl: './edit-stand.component.html',
  styleUrls: ['./edit-stand.component.css']
})
export class EditStandComponent {
  editStandForm!: FormGroup;
  zones: string[] = [];
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private standService: StandServiceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Initialize the form
    this.editStandForm = new FormGroup({
      zone: new FormControl('', [Validators.required]),
      number: new FormControl(0, [Validators.required])
    });

    // Get the stand ID from the URL
    const standId = this.route.snapshot.params['id'];

    // Check if ID is present to determine if it's an update
    if (standId) {
      // Use the service to get the details of the stand associated with this ID
      this.standService.getStandById(standId).subscribe((standDetails) => {
        // Populate the form with the stand details
        this.editStandForm.setValue({
          zone: standDetails.zone,
          number: standDetails.number
        });
      });
    }
  }

  onSubmit() {
    // Use the standService.updateStand method for stand update
    this.standService.updateStand(this.editStandForm.value,this.route.snapshot.params['id'])
    .subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('Le stand a été modifié avec succes');
        this.router.navigate(['/standList']);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error(error.error.message);
      },
    });
  }
}