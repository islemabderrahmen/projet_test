import { Stand } from './../../model/stand';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StandServiceService } from 'src/app/service/stannd-service.service';


@Component({
  selector: 'app-stand-list',
  templateUrl: './stand-list.component.html',
  styleUrls: ['./stand-list.component.css']
})
export class StandListComponent {

  constructor(
    private standService: StandServiceService,private toastr: ToastrService
  ) {}
  isLoading: boolean = false;
  stands: Stand[]=[];
  ngOnInit(): void {
    this.standService.listStand().subscribe((data) => {
      console.log(data);
      this.stands = data;
    });
  }
  
  deleteStand(id: number) {
    this.standService.deleteStand(id).subscribe({
      next: () => {
        this.stands = this.stands.filter(
          (stand: Stand) => stand.id != id

        )
        this.isLoading = false;
        this.toastr.success('Le stand a été supprimé avec succes');
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Une erreur est survenue lors de la suppression');
      },
    })
  }
}