import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CandidatureService } from 'src/app/service/candidature.service';
import { Candidature } from 'src/app/model/candidature';
@Component({
  selector: 'app-list-candidature',
  templateUrl: './list-candidature.component.html',
  styleUrls: ['./list-candidature.component.css']
})
export class ListCandidatureComponent {
  candidat: Candidature [] = [];
  constructor(private http: HttpClient,private router: Router,private candidatureService: CandidatureService){}
  ngOnInit():void {
    this.fetchCandidat();
    
  }
  fetchCandidat() {
    this.candidatureService.getDataCandidat().subscribe(
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
}
