import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidatureService } from 'src/app/service/candidature.service';
import { Status } from 'src/app/model/status';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html'
})
export class UpdateComponent implements OnInit {
  statusOptions: (string | Status)[] = Object.values(Status);
  id!: number;
  candidat: any;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    // Initialize the form group using FormBuilder
    this.registerForm = this.fb.group({
      status: ['', Validators.required]
    });

    this.id = this.route.snapshot.params['id'];
    this.candidatureService.getById(this.id).subscribe(
      (cand) => {
        this.candidat = cand;
        this.registerForm.patchValue(this.candidat);
      }
    );
  }

  reset() {
    this.registerForm.reset();
  }

  Annuler() {
    this.router.navigate(['/candidat']);
  }

  onSubmit() {
    console.log(this.registerForm.value);
  }

  update() {
    this.candidatureService.updateCandidature(this.id, this.registerForm.value).subscribe(
      {
        next: () => this.router.navigateByUrl('/candidat'),
        error: (error) => console.log(error)
      }
    );
  }
}
