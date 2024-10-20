import { Component } from '@angular/core';
import { RequestSupplyService } from '../../service/requeest-supply.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-old-requests',
  templateUrl: './old-requests.component.html',
  styleUrls: ['./old-requests.component.css']
})
export class OldRequestsComponent {
  listRequests!: any;
  searchTheme: string = ''; // Search theme input

  constructor(private requests: RequestSupplyService, private router: Router) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    if (this.searchTheme.trim() === '') {
      // If search theme is empty, load all old requests
      this.requests.getOldRequestsByIndividus().subscribe(
        (data) => {
          this.listRequests = data;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      // If search theme is provided, filter old requests by theme
      this.requests.getRequestSupplyByForumTheme(this.searchTheme).subscribe(
        (data) => {
          this.listRequests = data;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  deleteRequest(RequestId: number) {
    this.requests.DeleteRequest(RequestId).subscribe(
      () => {
        console.log('Offer deleted successfully.');
        // Refresh the list of requests after deletion
        this.loadRequests();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  confirmDelete(requestId: number) {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?');
    if (confirmed) {
      this.deleteRequest(requestId);
    }
  }

  navigateTolistDevis(requestId: any) {
    this.router.navigate(['/devis', requestId]);
  }

  // Function to search requests by theme
  searchByTheme() {
    this.loadRequests(); // Call loadRequests to apply search theme filter
  }
}
