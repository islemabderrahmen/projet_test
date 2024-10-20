
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs'; 
import { ForumServiceService } from 'src/app/service/foruum-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
 export class HeaderComponent implements OnInit, OnDestroy {
    futureDate!: Date;
    countdownText: string = '';
    private countdownSubscription!: Subscription;
    d : Date = new Date(2024,8,24);
    dd !: Date; 
    constructor(private forumService: ForumServiceService) {}
  
    ngOnInit(): void {
      this.forumService.getCurrentForum().subscribe((data) => {
        if (data && data.date) {
          const parsedDate = new Date(data.date);
          this.dd = data.date;
          console.log(parsedDate);
         // console.log(this.d);
          this.futureDate = parsedDate;
          if (!isNaN(parsedDate.getTime())) {
            this.startCountdown();
          }
        }
      });
    }
    ngOnDestroy(): void {
      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
    }
    startCountdown(): void {
      this.countdownSubscription = interval(1000).subscribe(() => {
        const currentDate = new Date();
        const timeDifference = this.futureDate.getTime() - currentDate.getTime();
  
        if (timeDifference >= 0) {
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
          this.countdownText = `${days}j ${hours}h ${minutes}m ${seconds}s`;
        } else {
          this.countdownText = 'Le compte à rebours est terminé !';
          this.countdownSubscription.unsubscribe();
        }
      });
    }
}  