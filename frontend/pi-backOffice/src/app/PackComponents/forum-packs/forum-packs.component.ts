import { Component } from '@angular/core';
import { Pack } from '../../model/pack';
import { reservationStatus } from '../../model/reservationStatus';
import { PackServiceService } from '../../service/pacck-service.service';
import { RouteReuseStrategy, Router } from '@angular/router';
import { StandServiceService } from '../../service/stannd-service.service';
import { Stand } from '../../model/stand';
import { TypePack } from 'src/app/model/typePack';

@Component({
  selector: 'app-forum-packs',
  templateUrl: './forum-packs.component.html',
  styleUrls: ['./forum-packs.component.css']
})
export class ForumPacksComponent {
  constructor(
    private packService: PackServiceService,
    private StandServiceService: StandServiceService,
    private Router: Router
  ) {}

    Gold:TypePack =  TypePack.Gold;
    Platinium:TypePack =  TypePack.Platinum;
    Silver:TypePack =  TypePack.Silver;
    Diamond :TypePack =  TypePack.Diamond;
 
  stands : Stand[]=[];
  packs: Pack[]=[];
  ngOnInit(): void {
   
  }
  
  ShowAvailablePackages(typePack : TypePack){
    this.Router.navigate(['reservationPack/' + typePack]);
  }

  renderToPersonalized(){
    this.Router.navigate(['personalizedPack/']);
  }
  
}
