import { Router } from '@angular/router';
import { StandServiceService } from 'src/app/service/stannd-service.service';
import { reservationStatus } from './../../model/reservationStatus';
import { Component } from '@angular/core';

import { Pack } from 'src/app/model/pack';
import { Stand } from 'src/app/model/stand';
import { PackServiceService } from 'src/app/service/pacck-service.service';


@Component({
  selector: 'app-packs-list',
  templateUrl: './packs-list.component.html',
  styleUrls: ['./packs-list.component.css'],
})
export class PacksListComponent {
  constructor(
    private packService: PackServiceService,
    private StandServiceService: StandServiceService,
    private Router: Router
  ) {}
  currentId!: any;
  currentAction !: String; 
  reserved: reservationStatus = reservationStatus.Reserved;
  onHold: reservationStatus = reservationStatus.On_Hold;
  notReserved: reservationStatus = reservationStatus.Not_Reserved;

  stands: Stand[] = [];
  packs: Pack[] = [];
  ngOnInit(): void {
    this.packService.listpack().subscribe((data) => {
      this.packs = data;
    });
  }

  openDialog(id: number, action: string) {
    this.currentId = id;
    this.currentAction = action;
    const modelDiv = document.getElementById('popup');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }

  handleDialogAction(event: any) {
    if (this.currentAction === 'supprimer') {
      this.deletePack(event);
    } else if (this.currentAction === 'valider') {
      this.validateReservation(event);
    }else{
      this.cancelReservation(event);
    }
  }

  deletePack(id: number) {
    this.packService
      .deletepack(id)
      .subscribe(
        () => (this.packs = this.packs.filter((pack: Pack) => pack.id != id))
      );
  }

  addPack() {
    this.StandServiceService.getStandByStatut(false).subscribe((data) => {
      this.stands = data;
      if (this.stands.length >= 1) {
        this.Router.navigate(['/addPack']);
      } else {
      }
    });
  }

  validateReservation(id: number) {
    this.packService.validateReservation(id).subscribe(()=>{
      const index = this.packs.findIndex(pack => pack.id === id);
      this.packs[index].reservationStatus = 'Reserved';
    } 
    );
  }
  cancelReservation(id: number) {
    this.packService.cancelReservation(id).subscribe(()=>{
      const index = this.packs.findIndex(pack => pack.id === id);
      this.packs[index].reservationStatus = 'Not_Reserved';

    } 
    );
  }
}