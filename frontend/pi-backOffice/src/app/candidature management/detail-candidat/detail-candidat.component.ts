import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatureService } from 'src/app/service/candidature.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room } from 'src/app/model/room';
import { Interview } from 'src/app/model/interview';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail-candidat',
  templateUrl: './detail-candidat.component.html',
  styleUrls: ['./detail-candidat.component.css']
})
export class DetailCandidatComponent {
  id!:number;
  candidat!:any;
  //test
  offerDates: Date[] = [];
  candidatArray: Date[] = []; // Initialiser avec un tableau vide
  selectedDate: Date | undefined;
  registerForm!: FormGroup;
  rooms: Room[] = [];
  calendarConfig = {}; 
  isOnline: boolean = false;
  isInRoom: boolean = false;
  interviewData: Interview | null = null;
  constructor(private route: ActivatedRoute,private service:CandidatureService,private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private candidatureService: CandidatureService){
    this.id=this.route.snapshot.params['id'];
    }
    ngOnInit(){
      this.service.getById(this.id).subscribe({
        next: (data) => {
          this.candidat = data;

          // Assuming candidat.offre contains the Offer object
          if (this.candidat && this.candidat.offer) {
            // Initialiser candidatArray avec les trois dates de l'offre
            this.candidatArray = [this.candidat.offer.date1, this.candidat.offer.date2, this.candidat.offer.date3];
        }
        }
      });
      //test
      this.registerForm = this.fb.group({
        date: ['', Validators.required],
        lien: [''],
        room: [[]],
        interviewType: ['choisir une option'],
        titre:['']
      });
    
      this.registerForm.get('interviewType')?.valueChanges.subscribe((type) => {
        this.isOnline = type === 'online';
        this.isInRoom = type === 'inRoom';
      });
  
      this.id = this.route.snapshot.params['id'];
      this.candidatureService.getRooms().subscribe(
        (response: Room[]) => {
          this.rooms = response;
        },
        error => {
          console.error('Error fetching rooms', error);
        }
      );
      
     }
  
     
    reset() {
      this.registerForm.reset();
    }
    onSelectDate(event: any) {
      const selectedValue = (event.target as HTMLSelectElement).value;
      this.selectedDate = new Date(selectedValue);
      // Remove selected date from candidatArray
      this.candidatArray = this.candidatArray.filter(d => d !== this.selectedDate);
    }
    
    
    Annuler() {
      this.router.navigate(['/listCandidat']);
    }
  
    onSubmit() {
      console.log(this.registerForm.value);
     
    }
    Ajouter() {
      console.log('Data to be sent:', this.registerForm.value);
    
      const intervData = {
        idInterview: this.id,
        interviewType: this.registerForm.value.interviewType,
        date: this.registerForm.get('date')?.value,
      };
    
      const url = `http://localhost:8087/interview/ajouterI/${this.id}`;
      
      this.candidatureService.addInterview(url, intervData).subscribe(
        {
          next: () => this.router.navigateByUrl('/listCandidat'),
          error: (error) => console.log(error)
        }
      );
    }
   
    Add1(){
      console.log('Data to be sent:', this.registerForm.value);
    
      const Data = {
        idInterview: this.id,
        interviewType: this.registerForm.value.interviewType,
        date: this.registerForm.get('date')?.value,
        titre :this.registerForm.value.titre,
        
      };
    
      const url = `http://localhost:8087/interview/addIEnligne/${this.id}`;
      
      this.candidatureService.addInterview(url, Data).subscribe( (response) =>
        {
          console.log('Interview ajoutée avec succès:', response);
           this.router.navigateByUrl('/listCandidat');
        },
         (error) => console.log('Erreur lors de l\'ajout de l\'interview:',error)
       
      );   
    }

}
