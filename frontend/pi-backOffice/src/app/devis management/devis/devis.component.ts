import { Component } from '@angular/core';
import { DeviisService } from '../../service/deviis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.css']
})
export class DevisComponent {
  listDeviss!:any;
  requestId!: any; 
  currentId: any;
  currentAction: any;
  constructor(private devis:DeviisService,private router:Router,   private route: ActivatedRoute ,  private toastr: ToastrService   ){}
  ngOnInit(): void {
    const params = this.route.snapshot.params;
    if (params['requestId']) {
      this.requestId = +params['requestId'];
      this.loadDeviss();
    } else {
      console.error('Missing requestId in route parameters');
      // Handle missing requestId (e.g., redirect, display error message)
    }
  }

  loadDeviss() {
    if (this.requestId) { // Check if requestId is available before making the call
      this.devis.getDevisByRequest(this.requestId).subscribe(
        (data) => {
          this.listDeviss = data;
        },
        (error) => {
          console.error('Error fetching devis:', error);
          // Handle errors during devis fetching (e.g., display error message)
        }
      );
    }
  }
  openDialog(id: number, action: string) {
    this.currentId = id;
    this.currentAction = action;
    const modelDiv = document.getElementById('popup');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }
 
 
  updateDevisStatus(id: number, newStatus: string) {
    
      this.devis.updateDevisStatus(id, "Accepted").subscribe(
        () => {
          this.toastr.success('devis accepté');
          this.currentId = '';
          this.currentAction = '';
          console.log(' status de devis modifiée .');
          // Actualiser la liste des offres après la mise à jour du statut
          this.loadDeviss();
        },
        (error) => {
          this.toastr.error(error.error.message);
        },
    );
    
  }
  handleDialogAction(event: any) {
    if (this.currentAction === 'Accepted') {
      this.updateDevisStatus(this.currentId,this.currentAction);
    }
  }
  
    viewFile(fileName: string) {
      const fileUrl = this.devis.getFileUrl(fileName);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
    }
}
