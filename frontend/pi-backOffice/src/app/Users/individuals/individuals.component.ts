import { Component } from '@angular/core';
import { Forum } from '../../model/forum';
import { Individu } from 'src/app/model/individus';
import { Authentication } from '../../service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { IndividuRole } from 'src/app/model/individusRole';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-individuals',
  templateUrl: './individuals.component.html',
  styleUrls: ['./individuals.component.css'],
})
export class IndividualsComponent {
  constructor(
    private consumer: Authentication,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}
  individus: Individu[] = [];
  currentId: any;
  currentAction: any;
  typeOfActivation: boolean = false;
  listFilter!: FormGroup;
  individuRole: IndividuRole[] = Object.values(IndividuRole).filter((role) => {
    return (
      role !== IndividuRole.Admin &&
      role !== IndividuRole.Community &&
      role !== IndividuRole.FinancialDirection
    );
  });
  ngOnInit(): void {
    this.consumer.getAllIndividu().subscribe((data: Individu[]) => {
      this.individus = data;
    });
    this.listFilter = this.formBuilder.group({
      role: [''],
      search: [''],
    });
    this.listFilter
      .get('role')
      ?.valueChanges.subscribe((role: IndividuRole) => {
        this.roleFilter(role);
      });
  }

  searchFilter(form: FormGroup) {
    this.consumer
      .getAllIndividuFilteredByField(form.get('search')!.value)
      .subscribe({
        next: (filteredIndividus: Individu[]) => {
          this.individus = filteredIndividus;
        },
        error: () => {
          this.consumer.getAllIndividu().subscribe((data: Individu[]) => {
            this.individus = data;
          });
        },
      });
  }
  roleFilter(role: IndividuRole) {
    this.consumer.getAllIndividuFilteredByRole(role).subscribe({
      next: (filteredIndividus: Individu[]) => {
        this.individus = filteredIndividus;
      },
      error: () => {
        this.consumer.getAllIndividu().subscribe((data: Individu[]) => {
          this.individus = data;
        });
      },
    });
  }

  openDialog(id: string, action: string, type: boolean) {
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
        next: (updatedIndividu: any) => {
          const index = this.individus.findIndex(
            (individu) => individu.id === id
          );
          if (index !== -1) {
            this.individus[index] = updatedIndividu;
          }
          this.toastr.success('User approved successfully');
          this.currentId = '';
          this.currentAction = '';
          if (
            this.individus[index].role == IndividuRole.Alumni ||
            this.individus[index].role == IndividuRole.Student
          ) {
            this.sendQRCode(id);
          }
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
        next: (updatedIndividu: any) => {
          const index = this.individus.findIndex(
            (individu) => individu.id === id
          );
          if (index !== -1) {
            this.individus[index] = updatedIndividu;
          }
          const message = updatedIndividu.activate
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

  sendQRCode(id: string) {
    this.consumer.generateQRCode(id).subscribe({
      next: () => {
        this.toastr.success(
          'un email a été envoyé contenant un code qr pour ce etudiant'
        );
      },
      error: (error) => {
        this.toastr.error(error);
      },
    });
  }
}
