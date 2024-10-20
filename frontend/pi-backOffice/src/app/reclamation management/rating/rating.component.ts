import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReclamationService } from 'src/app/service/reclamation.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  @Input() reclamationId!: number;
  selectedRating!: number;
  previousRating!: number;

  constructor(private reclamationService: ReclamationService,    private toastr: ToastrService,
    ) {}

  ngOnInit(): void {
    this.reclamationService.getRating(this.reclamationId).subscribe(
      (rating: number) => {
        this.previousRating = rating;
        this.selectedRating = rating; // Initialize selectedRating with previous rating
        

      },
      (error) => {
        console.error('Error loading previous rating:', error);

      }
    );
  }

  rateReclamation() {
    if (!this.reclamationId || !this.selectedRating) {
      console.error('Reclamation ID or rating is missing');
      this.toastr.success('Something went wrong!');

      return;
    }
    
    this.reclamationService.rateReclamation(this.reclamationId, this.selectedRating)
      .subscribe(response => {
        console.log('Rating submitted successfully');
        this.toastr.success('Your Rating has been updated successfully');
        // Handle success or error
      });
  }
  getStarIcon(star: number): string {
    return this.selectedRating >= star ? '&#9733;' : '&#9734;'; // Unicode for filled and empty star
  }
}
