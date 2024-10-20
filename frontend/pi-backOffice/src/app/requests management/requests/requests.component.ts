import { Component } from '@angular/core';
import { RequestSupplyService } from '../../service/requeest-supply.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent {
  listRequests!:any;
  currentId: any;
  currentAction: any;
  constructor(private requests:RequestSupplyService,private router:Router,  private toastr: ToastrService ){}
  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.requests.getRequestsByIndividus().subscribe(
      (data) => {
        this.listRequests = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  deleteRequest(RequestId: number) {
    this.requests.DeleteRequest(RequestId).subscribe(
      () => {
        console.log('req deleted successfully.');
        // Actualiser la liste des offres après la suppression
        this.toastr.success('demande suuprimée  ');
          this.currentId = '';
          this.currentAction = '';
        this.loadRequests();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message);

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
  openDialog(id: number, action: string) {
    this.currentId = id;
    this.currentAction = action;
    const modelDiv = document.getElementById('popup');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }
  handleDialogAction(event: any) {
    if (this.currentAction === 'delete') {
      this.deleteRequest(event);
    } 
  }

}
