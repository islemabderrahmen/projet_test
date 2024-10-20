import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviisService } from 'src/app/service/deviis.service';

@Component({
  selector: 'app-devis-by-society',
  templateUrl: './devis-by-society.component.html',
  styleUrls: ['./devis-by-society.component.css']
})
export class DevisBySocietyComponent {
  listDeviss!:any;
idsociety!:string;
currentId: any;
currentAction: any;
  constructor(private devis:DeviisService,private router:Router,  private toastr: ToastrService ){}
  ngOnInit(): void {
   
      this.loadDeviss();
    
  }

  loadDeviss() {
    
      this.devis.getDevisBySociety(this.idsociety).subscribe(
        (data) => {
          this.listDeviss = data;
          console.log(data);
        },
        (error) => {
          console.error('Error fetching devis:', error);
          // Handle errors during devis fetching (e.g., display error message)
        }
      );
    
  }

  deleteDevis(Id: number) {
    this.devis.DeleteDevis(Id).subscribe(
      () => {
        console.log('devis deleted successfully.');
        this.toastr.success('devis suuprimé ');
          this.currentId = '';
          this.currentAction = '';
        // Actualiser la liste des offres après la suppression
        this.loadDeviss();
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.message);

      }
    );
  }

  navigateToAddInvoice(requestId: number | undefined): void {
    if (requestId) {
      this.router.navigate(['/addInvoice', requestId]);
    } else {
      console.error('Invalid or missing RequestSupply id.');
    }
  }
  viewFile(fileName: string) {
    const fileUrl = this.devis.getFileUrl(fileName);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
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
      this.deleteDevis(event);
    } 
  }
}