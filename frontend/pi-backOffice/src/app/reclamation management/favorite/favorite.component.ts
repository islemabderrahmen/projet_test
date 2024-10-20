import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Reclamation } from 'src/app/model/reclamation';
import { ReclamationService } from 'src/app/service/reclamation.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent {
  constructor(
    private reclamationService: ReclamationService,
    
    private router: Router,
    private toastr: ToastrService
    ) { }
  reclamations: Reclamation[] = [];

  
  ngOnInit() {
    this.reclamationService.getFavorite().subscribe((data) => {
      this.reclamations = data;
    });
  }


  currentPage: number = 1;
  itemsPerPage: number = 9;
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage - 1, this.reclamations.length - 1);
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
 
 
}
