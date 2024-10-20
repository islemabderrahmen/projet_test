import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sponsor } from '../model/sponsor';
import { UserService } from '../service/user-service.service';

@Component({
  selector: 'app-sponsor-edit',
  templateUrl: './sponsor-edit.component.html',
  styleUrls: ['./sponsor-edit.component.css']
})
export class SponsorEditComponent implements OnInit {
  sponsor: Sponsor = new Sponsor();

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {}

 // Dans votre fichier de composant, par exemple sponsor-edit.component.ts

ngOnInit() {
  this.route.params.subscribe(params => {
    const id = +params['id']; // Convertit 'id' en nombre
    if (id) {
      this.userService.recordSponsorView(id).subscribe(sponsor => {
        this.sponsor = sponsor; // Mettez à jour votre modèle avec les détails du sponsor
        console.log(`View recorded for sponsor ${id}`);
      }, error => {
        console.error(`Failed to record view for sponsor ${id}:`, error);
      });
    }
  });
}


  onSubmit() {
    this.userService.updateSponsor(this.sponsor).subscribe(updatedSponsor => {
      console.log('Sponsor updated successfully:', updatedSponsor);
      // Vous pouvez naviguer de retour à la liste des sponsors ou à une autre page
      this.router.navigate(['/users']);
    });
  }

  // Assurez-vous d'avoir la méthode recordSponsorView dans votre service
}
