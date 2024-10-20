import { Component } from '@angular/core';
import { RequestSupplyService } from '../../service/requeest-supply.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests-index',
  templateUrl: './requests-index.component.html',
  styleUrls: ['./requests-index.component.css']
})
export class RequestsIndexComponent {
  listRequests!:any;

  constructor(private requests:RequestSupplyService,private router:Router){}
  ngOnInit(): void {
    this.loadRequests();
  }
  truncateDescription(text: string, maxLength: number, showFullDescription: boolean): string {
    if (showFullDescription) {
      return text; 
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }
  showFullDescription(request: any): void {
    request.showFullDescriptionFlag = !request.showFullDescriptionFlag;
  }
  loadRequests() {
    this.requests.recommendRequestsForSociety().subscribe(
      (data) => {
        this.listRequests = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  navigateToAddDevis(requestId: number) {
    this.router.navigate(['/createDevisAndAssignToRequest', requestId]);
  }
 
  
}
