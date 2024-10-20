import { Component } from '@angular/core';
import { Reclamation } from '../../model/reclamation';
import { TypeReclamation } from '../../model/typeReclamation';
import { User } from '../../model/user';
import { ReclamationService } from '../../service/reclamation.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.css'],
})
export class FeedBackComponent {
  constructor(
    private reclamationService: ReclamationService,

    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}
  reclamations: Reclamation[] = [];
  form!: FormGroup;

  ngOnInit() {
    this.reclamationService.getFeed().subscribe((data) => {
      console.log(data);
      this.reclamations = data;
    });
    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
      termsAndConditions: [false, Validators.requiredTrue],
    });
  }

  addFavorite(reclamation: Reclamation) {
    this.reclamationService.addToFavorites(reclamation.id).subscribe({
      next: () => {
        this.toastr.success('Your Reclamation has been added to favorite');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Something went wrong!');
      },
    });
  }

  currentPage: number = 1;
  itemsPerPage: number = 3;
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(
      this.startIndex + this.itemsPerPage - 1,
      this.reclamations.length - 1
    );
  }

  totalPages(): number {
    return Math.ceil(this.reclamations.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  create(reclamation: any) {
    let form2: any = {};
    form2.description = reclamation.description;
    console.log(form2);

    this.reclamationService.createReclamation(form2).subscribe({
      next: (response) => {
        this.toastr.success('Your Reclamation has been created successfully');
        console.log(response);
      },
      error: (error) => {
        // this.toastr.error(error.error.message);
        this.toastr.success('Something went wrong!');
        console.error(error);
      },
    });
  }
  private serializeForm(form: FormGroup): any {
    const serializedForm: any = {};
    Object.keys(form.controls).forEach((key) => {
      serializedForm[key] = form.get(key)?.value;
    });
    return serializedForm;
  }
}
