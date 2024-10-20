import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CandidatureService } from '../service/candidature.service';
import { Room } from '../model/room';
import { OfferService } from '../service/offer.service';
@Component({
  selector: 'app-postuler',
  templateUrl: './postuler.component.html',
  styleUrls: ['./postuler.component.css']
})
export class PostulerComponent {
  id!: number;
  candidat: any;
  offer:any;
  registerForm!: FormGroup;
  selectedFile: File | undefined;
  selectedFile1: File | undefined;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private candidatureService: CandidatureService,
    private offerService:OfferService
  ) {this.id=this.route.snapshot.params['id']}
  ngOnInit(): void {
    this.offerService.getById(this.id).subscribe({next:(data)=>this.offer=data}
      );
    this.registerForm = this.fb.group({
      cv: ['',Validators.required],
      lettre:['',Validators.required],
    });
  
  }
  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }
  onFileChange1(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile1 = fileList[0];
    }
  }
  reset() {
    this.registerForm.reset();
  }
  onSubmit() {
    console.log(this.registerForm.value);
  }
  Add() {
    const formData = new FormData();
    formData.append('cv', this.selectedFile!, this.selectedFile!.name);
    formData.append('lettre', this.selectedFile1!, this.selectedFile1!.name);
    this.candidatureService.addCandidat(this.id,formData).subscribe({
      next: (candidature) => {
        // Handle successful response
        console.log('Candidature created:', candidature);
        this.router.navigateByUrl('/listCandidat');
      },
      error: (error) => {
        // Handle errors gracefully
        console.error('Error creating candidature:', error);
        // Display appropriate error messages to the user
      }
    });
  }
  
  goToCandidature() {
    // Navigate to the update component with the client's ID as parameter
    this.router.navigate(['/listCandidat']);
  }   

}
