import { Component, OnInit } from '@angular/core';
import { Sponsor } from '../model/sponsor';
import { UserService } from '../service/user-service.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  sponsors!: Sponsor[];
  sponsor: Sponsor = new Sponsor(); // Make sure this matches your model
  mostViewedSponsor?: Sponsor; // Ajoutez cette propriété pour le sponsor le plus vu


  initiateCall(phoneNumber: string): void {
    // Vous pouvez exécuter des actions ici avant de transmettre la valeur 'true'
    console.log("Initiating call...");
    // Transmettre la valeur 'true' à d'autres composants ou services si nécessaire
    if (phoneNumber) {
      // Exemple: Vous pouvez déclencher une méthode dans un service qui gère l'appel
      this.userService.makeCall(phoneNumber).subscribe(
        () => {
          console.log("Appel initié avec succès !");
          // Gérer la réussite de l'appel ici
        },
        (error) => {
          console.error("Erreur lors de l'initiation de l'appel :", error);
          // Gérer les erreurs ici
        }
      );
    }
  }


  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAllSponsors();
    this.loadMostViewedSponsor(); // Appelez cette méthode dans ngOnInit pour charger le sponsor le plus vu
  }

  loadAllSponsors(): void {
    this.userService.findAll().subscribe(data => {
      this.sponsors = data;
    });
  }

  loadMostViewedSponsor(): void {
    this.userService.getMostViewedSponsor().subscribe(data => {
      this.mostViewedSponsor = data; // Stockez les informations du sponsor le plus vu
    }, error => {
      console.error('Erreur lors du chargement du sponsor le plus vu:', error);
    });
  }

  reloadData() {
    this.userService.findAll();
  }

  onSubmit() {
    console.log(this.sponsor);
    // Here you can call userService to save sponsor data
    // For example, if you have a saveSponsor method in your service
    // this.userService.saveSponsor(this.sponsor).subscribe(...);
  }
  deleteSponsor(idSponsor: number) {
    this.userService.deleteSponsor(idSponsor).subscribe(() => {
      console.log('Sponsor deleted successfully');
      this.reloadData(); // Rechargez la liste des sponsors après la suppression
    }, error => {
      console.error('Error deleting sponsor:', error);
    });
  }



  editSponsor(sponsor: Sponsor) {
    this.userService.updateSponsor(sponsor).subscribe(updatedSponsor => {
      // Replace the existing sponsor with the updated one
      const index = this.sponsors.findIndex(sponsor => sponsor.name === updatedSponsor.name);
      if (index !== -1) {
        this.sponsors[index] = updatedSponsor;
      }
    });
  }



  
  
}