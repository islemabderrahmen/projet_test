import { ForumServiceService } from 'src/app/service/foruum-service.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-forum',
  templateUrl: './add-forum.component.html',
  styleUrls: ['./add-forum.component.css']
})
export class AddForumComponent {


  addForumForm!: FormGroup;
  zones: string[] = [];
  isLoading: boolean = false;
  forumAffiche !: any; 
  affiche !: any; 
  constructor(private route: ActivatedRoute, private router:Router,  private toastr: ToastrService, private forumService: ForumServiceService) {}
  
  ngOnInit() {
    this.addForumForm = new FormGroup({
      theme: new FormControl('', [Validators.required]),
      date: new FormControl(null, [Validators.required, this.futureDateValidator]),// assuming you want to initialize with current date
      localisation: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      affiche : new FormControl(null, [Validators.required]),
    });
  }

  futureDateValidator(control: FormControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    return selectedDate > currentDate ? null : { 'invalidFutureDate': true };
  }

  onSubmit() {
    const formData = new FormData();
   

    // Ensure an image file is selected
    if (this.forumAffiche) {
        formData.append('image', this.forumAffiche, this.forumAffiche.name); // Append the image file to FormData
    }

    // Append other form data
    formData.append('theme', this.addForumForm.get('theme')?.value);
    formData.append('date', this.addForumForm.get('date')?.value);
    formData.append('localisation', this.addForumForm.get('localisation')?.value);
    formData.append('description', this.addForumForm.get('description')?.value);

    this.isLoading = true;  
    this.forumService.addForum(formData).subscribe({
        next: () => {
            this.isLoading = false;
            this.toastr.success('Le forum  a été ajouté avec succès');
            this.router.navigate(['/forumList']);
        },
        error: (error) => {
            this.isLoading = false;
            this.toastr.error('Une erreur est survenue lors de lajout');
        },
    });
}

onImageSelected(event: any) {
  const file = event.target.files[0];
  this.forumAffiche = file;
}
  
}
//this.router.navigateByUrl("/forumList"); 
