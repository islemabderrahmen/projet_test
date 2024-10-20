import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatureService } from 'src/app/service/candidature.service';
import { Candidature } from 'src/app/model/candidature';
@Component({
  selector: 'app-candidature', 
  templateUrl: './candidature.component.html',
  styleUrls: ['./candidature.component.css']
})
export class CandidatureComponent {
  id!: number;
  candidat: Candidature [] = [];
  constructor(private http: HttpClient,private router: Router,private candidatureService: CandidatureService,private route: ActivatedRoute){
    this.id=this.route.snapshot.params['id']
  }
  ngOnInit():void {
    this.fetchCandidat();
    
  }
  fetchCandidat() {
    this.candidatureService.getData(this.id).subscribe(
      (response: Candidature[]) => {
        console.log('API Response:', response); // Log the API response
        this.candidat = response;
        console.log('candidat:', this.candidat);
         
      },
      error => {
        console.error('Error fetching candidat', error);
        // Handle error as needed
      }
    );
  }
  downloadCv(candidateId: number) {
    this.candidatureService.downloadCv(candidateId);
  }

  onEditClick(candidatId: number) {
    // Navigate to the update component with the client's ID as parameter
    this.router.navigate(['/updateC', candidatId]);
  }
  onAddIntervClick(candidatId: number) {
    // Navigate to the update component with the client's ID as parameter
    this.router.navigate(['/addInterv', candidatId]);
  }
  updateIntrview(idI:number){
    this.router.navigate(['/updateI',idI]);
  }
  goToInterview(id: number) {
    // Naviguer vers le composant de liste des entretiens avec l'ID de l'offre en tant que paramètre
    this.router.navigate(['/listInterv', { id: id }]);
  }

  goToInterviewvalider(id: number) {
    // Naviguer vers le composant de liste des entretiens validés avec l'ID de l'offre en tant que paramètre
    this.router.navigate(['/valideInterview', { id: id }]);
  }
  acceptCandidature(candidateId: number) {
    this.candidatureService.accepterCandidature(candidateId).subscribe(
      (response: Candidature) => {
        console.log('Candidature accepted:', response);
        this.fetchCandidat();
      },
      error => {
        console.error('Error accepting candidature', error);
        // Handle error as needed
      }
    );
  }
  refuseCandidature(candidateId: number) {
    this.candidatureService.refuserCandidature(candidateId).subscribe(
      (response: Candidature) => {
        console.log('Candidature accepted:', response);
        this.fetchCandidat();
      },
      error => {
        console.error('Error accepting candidature', error);
        // Handle error as needed
      }
    );
  }
  
}
