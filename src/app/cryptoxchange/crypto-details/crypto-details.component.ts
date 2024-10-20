import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Chart } from 'chart.js';
import { CryptoService } from '../../services/crypto.service';
import { registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { BehaviorSubject, Subject, combineLatest, takeUntil } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';

Chart.register(...registerables);

@Component({
  selector: 'app-crypto-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.scss'],
})
export class CryptoDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('priceChart') priceChartCanvas!: ElementRef; // Added non-null assertion operator
  cryptoDetails: any;
  chart: Chart | undefined;
  isFavorite: boolean = false; // To track if the current crypto is a favorite

  private priceData$ = new BehaviorSubject<any[]>([]);
  private viewReady$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.loadCryptoDetails(id);
      this.checkIfFavorite(id);
    });

    combineLatest([this.priceData$, this.viewReady$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([priceData, viewReady]) => {
        if (priceData.length > 0 && viewReady) {
          this.createChart(priceData);
        }
      });
  }

  ngAfterViewInit() {
    this.viewReady$.next(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadCryptoDetails(id: string) {
    this.cryptoService.getCryptoDetails(id).subscribe(
      (data: any) => {
        this.cryptoDetails = data.data;

        this.cryptoService.getCryptoHistory(id).subscribe(
          (data: any) => {
            const priceData = data.data.map((item: any) => ({
              x: new Date(item.time),
              y: parseFloat(item.priceUsd),
            }));
            this.priceData$.next(priceData);
          },
          (error) => console.error('Error fetching crypto history:', error)
        );
      },
      (error) => console.error('Error fetching crypto details:', error)
    );
  }

  createChart(priceData: any[]) {
    if (this.chart) {
      this.chart.destroy();
    }
    const ctx = this.priceChartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Price (USD)',
            data: priceData,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
          },
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  }

  checkIfFavorite(id: string) {
    const favorites = JSON.parse(
      this.localStorageService.getItem('favorites') || '[]'
    );

    this.isFavorite = favorites?.includes(id) || false;
  }

  toggleFavourite() {
    const favorites = JSON.parse(
      this.localStorageService.getItem('favorites') || '[]'
    );
    const index = favorites.indexOf(this.cryptoDetails.id);

    if (index === -1) {
      // Add to favorites
      favorites.push(this.cryptoDetails.id);
      this.isFavorite = true;
    } else {
      // Remove from favorites
      favorites.splice(index, 1);
      this.isFavorite = false;
    }

    // Save the updated favorites list to local storage
    this.localStorageService.setItem('favorites', JSON.stringify(favorites));
  }

  addFavourite() {}
}
