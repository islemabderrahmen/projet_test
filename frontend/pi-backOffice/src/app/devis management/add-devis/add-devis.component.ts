import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { DeviisService } from 'src/app/service/deviis.service';

@Component({
  selector: 'app-add-devis',
  templateUrl: './add-devis.component.html',
  styleUrls: ['./add-devis.component.css']
})
export class AddDevisComponent {
  devisForm!: FormGroup;
  selectedFile: File | undefined;

 requestId!: number; 

  constructor(
    private devis: DeviisService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.devisForm = new FormGroup({
      file: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required)
    });

    const params = this.route.snapshot.params;
    if (params['requestId']) {
      this.requestId = +params['requestId'];
    } else {
      console.error('Missing requestId in route parameters');
      // Handle missing requestId (e.g., redirect, display error message)
    }
  }
  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }
  onSubmit() {
    console.log(this.devisForm.value);
    //alert('Success\n\n' + JSON.stringify(this.devisForm.value, null, 4));
  }

  reset() {
    this.devisForm.reset();
  }


  
  ajouter() {
      if (this.devisForm.valid) {
          // Construct 'devis' object from form fields
          const devisData = {
              description: this.devisForm.get('description')?.value,
              price: this.devisForm.get('price')?.value,
              quantity: this.devisForm.get('quantity')?.value
          };
  
          // Append 'devis' object to FormData
          const formData = new FormData();
          formData.append('devis', JSON.stringify(devisData));
          formData.append('file', this.selectedFile!, this.selectedFile!.name);
  
          // Call the service function with the requestId and FormData
          this.devis.createDevisAndAssignToRequest(this.requestId, this.devisForm.value, formData).subscribe(
              () => {
                  console.log(this.requestId);
                  console.log('Devis créer avec succée');
                  this.toastr.success('Devis créer avec succée.'); // Success toaster notification
                  this.router.navigateByUrl('/devis'); // Navigate to 'devis' route after success
              },
              error => {
                  console.error('Erreur creation de Devis:', error);
                  this.toastr.error('Erreur creation de Devis:', error); // Error toaster notification
                  // Handle errors during devis creation (e.g., display error message)
              }
          );
      } else {
          console.error(' form de Devis invalid!');
          this.toastr.error(' form de Devis invalid!'); // Invalid form toaster notification
      }
  }
  
  
}
