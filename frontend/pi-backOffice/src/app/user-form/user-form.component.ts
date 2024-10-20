import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user-service.service';
import { Sponsor } from '../model/sponsor';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {

  sponsor: Sponsor;
  sponsors: Sponsor[] = []; // Array of sponsors


  constructor(
    private route: ActivatedRoute, 
      private router: Router, 
        private userService: UserService) {
    this.sponsor = new Sponsor();
  }

  onSubmit() {
    this.userService.save(this.sponsor).subscribe(result => this.gotoUserList());
  }

  gotoUserList() {
    this.router.navigate(['/users']);
  }
  
}