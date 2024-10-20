import { Component, OnInit } from '@angular/core';
import { ForumServiceService } from 'src/app/service/foruum-service.service';
import { Forum } from 'src/app/model/forum';
import { Router } from '@angular/router';




import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {


  constructor(
    private forumService: ForumServiceService, private router: Router, private toastr: ToastrService
  ) { }

  forums: Forum[] = [];
  openPopup: boolean = false;
  test :boolean = false; 
  currentId: any;
  currentAction: any;
  isLoading: boolean = false;
  ngOnInit(): void {
    this.forumService.listForum().subscribe((data) => {
      console.log(data);
      this.forums = data;
    });
  }

  cancelForum(id: number) {
    this.forumService.cancelForum(id).subscribe({
      next: () => {
        const index = this.forums.findIndex(forum => forum.id === id);
        this.forums[index].forumStatus = 'Canceled';
        this.isLoading = false;
        this.toastr.success('Le forum a été annulé avec succes');
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Une erreur est survenue lors de lannulation');
      },
    })}

  deleteForum(id: number) {
    this.forumService.deleteForum(id).subscribe({
      next: () => {
        this.forums = this.forums.filter(
          (forum: Forum) => forum.id != id
        )
        this.isLoading = false;
        this.toastr.success('Le forum a été supprimé avec succes');
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error('Une erreur est survenue lors de la suppression');
      },
    })}
 /* .subscribe({
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
  })*/

  addForum() {
    const isInProgress = this.forums.some(forum => forum.forumStatus === 'In_Progress');
    if (isInProgress) {
      this.toastr.error('Un forum est déjà en cours en préparation');
    } else {

        this.router.navigate(['/addForum']);
    }}

    openDialog(id: number, action: string) {
      this.currentId = id;
      this.currentAction = action;
      const modelDiv = document.getElementById('popup');
      if (modelDiv != null) {
        modelDiv.style.display = 'block';
      }
    }
  
    handleDialogAction(event: any) {
      if (this.currentAction === 'delete') {
        this.deleteForum(event);
      } else{
        this.cancelForum(event);
      }
    }
}


