import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatureService } from 'src/app/service/candidature.service';
import { Interview } from 'src/app/model/interview';

@Component({
  selector: 'app-interview-valider',
  templateUrl: './interview-valider.component.html',
  styleUrls: ['./interview-valider.component.css']
})
export class InterviewValiderComponent  implements OnInit {
  interviews: Interview[] = [];
  id!: number;
  constructor(
    private http: HttpClient,
    private router: Router,
    private candidatureService: CandidatureService,private route: ActivatedRoute
  ) {  this.id=this.route.snapshot.params['id']}

  ngOnInit(): void {
    this.fetchInterviewsByEtat('Valider');
  }

  fetchInterviewsByEtat(etat: string): void {
    this.candidatureService.getInterviewsByEtat(etat,this.id).subscribe(
      interviews => {
        this.interviews = interviews;
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  deleteInterview(id: number): void {
    this.candidatureService.delete(id).subscribe(
      {
        next: () => {
          console.log('Interview deleted successfully');
          // Reload the interview list after deletion
          this.fetchInterviewsByEtat('Non_Valider');
        },
        error: (error) => console.log('Error deleting interview', error)
      }
    );
  }
  acceptCandidature(candidateId: number) {
    this.candidatureService.accepterI(candidateId).subscribe(
      (response: Interview) => {
        console.log('Candidature accepted:', response);
        this.fetchInterviewsByEtat('Non_Valider');
      },
      error => {
        console.error('Error accepting candidature', error);
        // Handle error as needed
      }
    );
  }

  onDeleteClick(interviewId: number): void {
    const confirmation = window.confirm('Are you sure you want to delete this interview?');

    if (confirmation) {
      console.log('Deleting interview with ID:', interviewId);

      this.candidatureService.delete(interviewId).subscribe(
        () => {
          console.log('Interview deleted successfully');
          // Refresh the list of interviews after deletion
          this.fetchInterviewsByEtat('Non_Valider');
        },
        error => {
          console.error('Error deleting interview', error);
        }
      );
    }
  }
}
