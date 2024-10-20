import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Interview } from 'src/app/model/interview';
import { Room } from 'src/app/model/room';
import { CandidatureService } from 'src/app/service/candidature.service';

@Component({
  selector: 'app-update-interview',
  templateUrl: './update-interview.component.html',
  styleUrls: ['./update-interview.component.css']
})
export class UpdateInterviewComponent {
  id!:number;
  rooms: Room[] = [];
  interview:Interview|undefined;
  registerForm!: FormGroup;
  isOnline: boolean = false;
  isInRoom: boolean = false;
  constructor(private fb:FormBuilder,private service:CandidatureService,private router:Router,private route: ActivatedRoute){  
}
ngOnInit(){
  this.registerForm = this.fb.group({
    titre: [''],
    lien: [''],
    room: [[]],
    interviewType: [''],
    date: [''],
  });
  this.registerForm.get('interviewType')?.valueChanges.subscribe((type) => {
    this.isOnline = type === 'online';
    this.isInRoom = type === 'inRoom';
  });

  this.id=this.route.snapshot.params['id'];
  this.service .getRooms().subscribe(
    (response: Room[]) => {
      this.rooms = response;
    },
    error => {
      console.error('Error fetching rooms', error);
    }
  );
  this.service.getByIdInterview(this.id).subscribe(
    (c: Interview) => {
      this.interview = c;
      if (this.interview) {
        this.registerForm.patchValue(this.interview);
      }
    },
    error => console.log('Error fetching interview', error)
  );
}
Annuler() {
  this.router.navigate(['/offerBySociety']);
}
reset(){
  this.registerForm.reset();
}
onSubmit(){
  console.log(this.registerForm.value);
}
update() {
  if (!this.interview) {
    console.error('Interview not found');
    return;
  }
  this.service.updateInterview(this.id, this.registerForm.value).subscribe(
    () => this.router.navigate(['/offerBySociety']),
    error => console.error('Error updating interview', error)
  );
}
UpdateR() {
 
  const interviewData = {
    idInterview: this.id,
    interviewType: this.registerForm.value.interviewType,
    date: this.registerForm.value.date,
    lien: this.registerForm.value.lien,
    titre :this.registerForm.value.titre
  };

  const roomNum = this.registerForm.value.room;
  const url = `http://localhost:8087/interview/updateIR/${this.id}?room=${roomNum}`;
  
  this.service.updateInterviewR(url, interviewData).subscribe(
    {
      next: () => this.router.navigateByUrl('/offerBySociety'),
      error: (error) => console.log(error)
    }
  );
}
}
