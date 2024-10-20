import { Component } from '@angular/core';
import { DeviisService } from '../../service/deviis.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-old-devis-by-society',
  templateUrl: './old-devis-by-society.component.html',
  styleUrls: ['./old-devis-by-society.component.css']
})
export class OldDevisBySocietyComponent {
  listDeviss!:any;
  idsociety!:string;
  
    constructor(private devis:DeviisService,private router:Router){}
    ngOnInit(): void {
     
        this.loadDeviss();
      
    }
  
    loadDeviss() {
      
        this.devis.getOldDevisBySociety(this.idsociety).subscribe(
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
          // Actualiser la liste des offres après la suppression
          this.loadDeviss();
        },
        (error) => {
          console.log(error);
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
}
