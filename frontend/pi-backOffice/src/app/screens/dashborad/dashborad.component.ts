import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../service/offer.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { Category } from 'src/app/model/category';
import { InvoiceService } from 'src/app/service/invoiice.service';
import { Authentication } from 'src/app/service/authentication.service';
import { RequestSupplyService } from 'src/app/service/requeest-supply.service';
import { ForumServiceService } from 'src/app/service/foruum-service.service';
import { PackServiceService } from 'src/app/service/pacck-service.service';
import { ReclamationService } from 'src/app/service/reclamation.service';
import { ToastrService } from 'ngx-toastr';
Chart.register(...registerables);

@Component({
  selector: 'app-dashborad',
  templateUrl: './dashborad.component.html',
  styleUrls: ['./dashborad.component.css'],
})
export class DashboradComponent implements OnInit {
  averageOffersPerDay: any;
  totalUsers: number = 0;
  listOffer!: any;
  OffreEnAttente: any;
  categoryOptions: string[] = Object.keys(Category).filter(
    (key: any) => !isNaN(Number(Category[key]))
  );
  categoryCounts: any;
  candidatCounts: any;
  individuStatistics: any;
  societyStat: any;
  user!: any;
  forumIncomes: any;
  packIncomes: any;
  totalAmountByIndividu: any;
  invoiceAcceptancePercentage: any;
  id!: string;
  usersRole: String[] = [];
  usersCount: number[] = [];
  constructor(
    private toastr: ToastrService,
    private reclamationService: ReclamationService,
    private invoiceService: InvoiceService,
    private consumer: Authentication,
    private offerService: OfferService,
    private requestSupplyService: RequestSupplyService,
    private forumService: ForumServiceService,
    private packService: PackServiceService
  ) {}

  ngOnInit(): void {
    this.user = this.consumer.user;
    this.packService.calculatePackIncomes().subscribe(
      (data) => {
        this.packIncomes = data;
        console.log(this.packIncomes);
      },
      (error) => {
        console.log('Error fetching forum incomes:', error);
      }
    );
    this.requestSupplyService.getIndividuStatistics().subscribe(
      (individuStatistics) => {
        this.individuStatistics = individuStatistics;
        this.pieChartForIndividus();
        console.log(individuStatistics);
      },
      (error) => {
        console.error('Error fetching individu statistics:', error);
      }
    );
    this.requestSupplyService.getSocietyStatistics().subscribe(
      (societyStat) => {
        this.societyStat = societyStat;
        this.pieChartForSociety();
        console.log(societyStat);
      },
      (error) => {
        console.error('Error fetching society statistics:', error);
      }
    );
    this.forumService.calculateForumIncomes().subscribe(
      (data) => {
        this.forumIncomes = data;
      },
      (error) => {
        console.log('Error fetching forum incomes:', error);
      }
    );
    this.invoiceService.calculateTotalAmountByIndividu(this.id).subscribe(
      (data: any) => {
        console.log('Total amount data:', data);
        this.totalAmountByIndividu = data;
      },
      (error) => {
        console.error('Error fetching total amount by individu:', error);
      }
    );
    this.offerService.getNbAcceptedOffer().subscribe(
      (average) => {
        this.OffreEnAttente = average;
      },
      (error) => {
        console.log('Error fetching average offers per day:', error);
      }
    );
    this.PieChartForUsers();
    this.PieChartForReclamation();
    this.fetchCategoryCounts();
    this.loadOffers();
  }
  pieChartForIndividus(): void {
    const canvas = document.getElementById(
      'individuChart'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    const data = {
      labels: [
        'Demandes en cours',
        'Devis acceptés',
        'Devis refusés',
        'Factures acceptées',
        'Factures refusées',
      ],
      datasets: [
        {
          label: ' Statistiques',
          data: [
            this.individuStatistics['RunningRequests'],
            this.individuStatistics['AcceptedDevis'],
            this.individuStatistics['RefusedDevis'],
            this.individuStatistics['AcceptedInvoices'],
            this.individuStatistics['RefusedInvoices'],
          ],
          backgroundColor: [
            '#8ecae6',
            '#9e2a2b',
            '#335c67',
            '#e63946',
            '#fb8500',
            '#ffb703',
            '#023047',
            '#219ebc',
          ],
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  }
  pieChartForSociety(): void {
    const canvas = document.getElementById('societyChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    const data = {
      labels: [
        'Devis acceptés',
        'Devis refusés',
        'Factures acceptées',
        'Factures refusées',
      ],
      datasets: [
        {
          label: 'Statistiques',
          data: [
            this.societyStat['AcceptedDevis'],
            this.societyStat['RefusedDevis'],
            this.societyStat['AcceptedInvoices'],
            this.societyStat['RefusedInvoices'],
          ],
          backgroundColor: ['#e63946', '#fb8500', '#ffb703', '#023047'],
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    new Chart(ctx, {
      type: 'pie',
      data: data,
      options: options,
    });
  }

  fetchCategoryCounts() {
    this.offerService.getOfferCountsByCategory().subscribe(
      (data: any) => {
        this.categoryCounts = data;
        this.PieChartOfferByCategory();
      },
      (error: any) => {
        console.error('Error fetching category counts:', error);
      }
    );
  }
  fetchCandidatureCounts() {
    if (!this.listOffer) {
      return;
    }
    this.offerService.getCandidaturesByOffer().subscribe(
      (data: any) => {
        const offerNames = Object.keys(data);
        const candidatureCounts = Object.values(data) as number[];
        this.PieChartCandidat(offerNames, candidatureCounts);
      },
      (error: any) => {
        console.error('Error fetching candidat counts:', error);
      }
    );
  }
  PieChartOfferByCategory() {
    const myChartOfUsers = new Chart('pie-chart-offer', {
      type: 'pie',
      data: {
        labels: this.categoryOptions,
        datasets: [
          {
            backgroundColor: [
              '#e63946',
              '#fb8500',
              '#ffb703',
              '#023047',
              '#219ebc',
              '#8ecae6',
            ],
            data: this.categoryOptions.map(
              (option) => this.categoryCounts[option] || 0
            ),
            label: 'Offre par catégorie',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  PieChartCandidat(offerNames: string[], candidatureCounts: number[]) {
    const myChartOfCandidat = new Chart('pie-chart-candidat', {
      type: 'pie',
      data: {
        labels: offerNames,
        datasets: [
          {
            backgroundColor: [
              '#e63946',
              '#fb8500',
              '#ffb703',
              '#023047',
              '#219ebc',
              '#8ecae6',
            ],
            data: candidatureCounts,
            label: 'Candidatures par offre',
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
  loadOffers() {
    this.offerService.getOffers().subscribe(
      (data) => {
        this.listOffer = data;
        this.fetchCandidatureCounts();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  PieChartForUsers() {
    this.consumer.getCountUsersByRole().subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        const roles = Object.keys(response);
        const counts: number[] = Object.values(response); // Explicitly typed as number[]

        const totalUsers = counts.reduce((total, count) => total + count, 0);
        console.log('Total Users:', totalUsers);

        // Update the totalUsers property
        this.totalUsers = totalUsers;

        const backgroundColors = [
          '#e63946',
          '#fb8500',
          '#ffb703',
          '#023047',
          '#219ebc',
          '#8ecae6',
          '#9e2a2b',
          '#335c67',
        ];
        const myChartOfUsers = new Chart('pie-chart', {
          type: 'pie',
          data: {
            labels: roles,
            datasets: [
              {
                backgroundColor: backgroundColors,
                data: counts,
                label: ' Nombre',
              },
            ],
          },
          options: {
            responsive: true,
          },
        });
      },
      error: () => {
        this.toastr.error('Something went wrong');
      },
    });
  }

  PieChartForReclamation() {
    this.reclamationService.getCountReclamationByType().subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        const roles = Object.keys(response);
        const counts = Object.values(response);
        const backgroundColors = ['#8ecae6', '#023047'];
        const myChartOfUsers = new Chart('reclamation-chart', {
          type: 'doughnut',
          data: {
            labels: roles,
            datasets: [
              {
                backgroundColor: backgroundColors,
                data: counts,
                label: ' Nombre',
              },
            ],
          },
          options: {
            responsive: true,
          },
        });
      },
      error: (er) => {
        console.log('sdas');
      },
    });
  }
}
