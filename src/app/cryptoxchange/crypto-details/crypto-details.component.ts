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
import { Cryptocurrency } from 'src/app/models/crypto.model';

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
  @ViewChild('priceChart')
  priceChartCanvas!: ElementRef;

  cryptoDetails!: Cryptocurrency;
  chart!: Chart;
  isFavorite = false;

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
        if (priceData.length && viewReady) {
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

  private loadCryptoDetails(id: string) {
    this.cryptoService.getCryptoDetails(id).subscribe(
      (data: any) => {
        this.cryptoDetails = data.data;
        this.loadCryptoHistory(id);
      },
      (error) => console.error('Error fetching crypto details:', error)
    );
  }

  private loadCryptoHistory(id: string) {
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
  }

  private createChart(priceData: any[]) {
    if (this.chart) {
      this.chart.destroy();
    }
    const ctx = this.priceChartCanvas?.nativeElement?.getContext('2d');
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

  public checkIfFavorite(id: string) {
    const favorites = this.getFavoritesFromLocalStorage();
    this.isFavorite = favorites.includes(id);
  }

  private getFavoritesFromLocalStorage(): string[] {
    return JSON.parse(this.localStorageService.getItem('favorites') || '[]');
  }

  toggleFavorite() {
    const favorites = this.getFavoritesFromLocalStorage();
    const index = favorites.indexOf(this.cryptoDetails?.id);

    if (index === -1) {
      favorites.push(this.cryptoDetails?.id);
      this.isFavorite = true;
    } else {
      favorites.splice(index, 1);
      this.isFavorite = false;
    }

    this.localStorageService.setItem('favorites', JSON.stringify(favorites));
  }
}
