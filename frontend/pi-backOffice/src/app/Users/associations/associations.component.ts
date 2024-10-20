import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Society } from 'src/app/model/society';
import { SocietyRole } from 'src/app/model/societyRole';
import { Authentication } from '../../service/authentication.service';

@Component({
  selector: 'app-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.css'],
})
export class AssociationsComponent {
  constructor(
    private consumer: Authentication,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}
  societies: Society[] = [];
  currentId: any;
  currentAction: any;
  typeOfActivation: boolean=false;
  listFilter!: FormGroup;
  societyRole: SocietyRole[] = Object.values(SocietyRole);
  ngOnInit(): void {
    this.consumer.getAllSocieties().subscribe((data) => {
      console.log(data);
      this.societies = data;
    });
    this.listFilter = this.formBuilder.group({
      role: [''],
      search: [''],
    });
    this.listFilter.get('role')?.valueChanges.subscribe((role) => {
      this.roleFilter(role);
    });
  }

  searchFilter(form: FormGroup) {
    this.consumer
      .getAllSocietiesFilteredByField(form.get('search')!.value)
      .subscribe({
        next: (filteredSocieties: Society[]) => {
          this.societies = filteredSocieties;
        },
        error: () => {
          this.consumer.getAllSocieties().subscribe((data) => {
            console.log(data);
            this.societies = data;
          });
        },
      });
  }
  roleFilter(role: SocietyRole) {
    this.consumer.getAllSocietiesFilteredByRole(role).subscribe({
      next: (filteredSocieties: Society[]) => {
        this.societies = filteredSocieties;
      },
      error: () => {
        this.consumer.getAllSocieties().subscribe((data) => {
          console.log(data);
          this.societies = data;
        });
      },
    });
  }

  openDialog(id: string, action: string,type:boolean) {
    this.currentId = id;
    this.currentAction = action;
    this.typeOfActivation = type;
    const modelDiv = document.getElementById('popup');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }

  handleDialogAction(event: any) {
    if (this.currentAction === 'approve') {
      this.approveUser(event);
    } else if (this.currentAction === 'activate') {
      this.activateUser(event);
    }
  }

  approveUser(id: string) {
    if (id != '') {
      this.consumer.approveUser(id).subscribe({
        next: (updatedSociete: any) => {
          const index = this.societies.findIndex(
            (societie) => societie.id === id
          );
          if (index !== -1) {
            this.societies[index] = updatedSociete;
          }
          this.toastr.success('User approved successfully');
          this.currentId = '';
          this.currentAction = '';
        },
        error: (error: any) => {
          this.toastr.error(error.error.message);
        },
      });
    }
  }

  activateUser(id: string) {
    if (id != '') {
      this.consumer.activateUser(id).subscribe({
        next: (updatedSociete: any) => {
          const index = this.societies.findIndex(
            (societie) => societie.id === id
          );
          if (index !== -1) {
            this.societies[index] = updatedSociete;
          }
          const message = updatedSociete.activate
            ? 'activated'
            : 'desactivated';
          this.toastr.success(`User ${message} successfully`);
          this.currentId = '';
          this.currentAction = '';
        },
        error: (error: any) => {
          this.toastr.error(error.error.message);
        },
      });
    }
  }
}
