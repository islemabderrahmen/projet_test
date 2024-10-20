import { StandServiceService } from '../../service/stannd-service.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-stand',
  templateUrl: './add-stand.component.html',
  styleUrls: ['./add-stand.component.css']
})
export class AddStandComponent {
 
    
      addForumForm!: FormGroup;
      zones: string[] = [];
      isLoading: boolean = false;
      constructor(private toastr: ToastrService, private route: ActivatedRoute, private standService: StandServiceService, private router: Router) {}
      ngOnInit() {
        this.addForumForm = new FormGroup({
          number: new FormControl(0, [Validators.required]),
          zone: new FormControl('', [Validators.required]),
        
        
        });
      }
      onSubmit() {
        console.log(this.addForumForm.value);
        this.standService.addStand(this.addForumForm.value).subscribe({
          next: () => {
            this.isLoading = false;
            this.toastr.success('Le stand a été ajouté avec succes');
            this.router.navigate(['/standList']);
          },
          error: (error) => {
            this.isLoading = false;
            this.toastr.error(error.error.message);
          },
        });
      }
}