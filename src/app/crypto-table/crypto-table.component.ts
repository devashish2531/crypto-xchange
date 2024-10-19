import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptoService } from '../services/crypto.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  marketCapUsd: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-crypto-table',
  templateUrl: './crypto-table.component.html',
  styleUrls: ['./crypto-table.component.scss'],
})
export class CryptoTableComponent implements OnInit, OnDestroy {
  cryptocurrencies: Cryptocurrency[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn = 'symbol';
  sortDirection = 'asc';
  private priceUpdatesSubscription: Subscription = new Subscription();

  constructor(private cryptoService: CryptoService, private router: Router) {}

  ngOnInit() {
    this.loadCryptocurrencies();
    this.subscribeToPriceUpdates();
  }

  ngOnDestroy() {
    this.unsubscribeFromPriceUpdates();
    this.cryptoService.disconnectWebSocket();
  }

  loadCryptocurrencies() {
    this.cryptoService.getCryptocurrencies().subscribe(
      (data: any) => {
        this.cryptocurrencies = data.data.map((crypto: any) => ({
          ...crypto,
          isFavorite: this.isFavorite(crypto.id),
        }));
        this.sortData();
        this.connectToWebSocket();
      },
      (error) => console.error('Error fetching cryptocurrencies:', error)
    );
  }

  connectToWebSocket() {
    const visibleCryptos = this.paginatedCryptocurrencies;
    const symbols = visibleCryptos.map((crypto) => crypto.symbol.toLowerCase());
    this.cryptoService.connectToWebSocket(symbols);
  }

  subscribeToPriceUpdates() {
    this.priceUpdatesSubscription = this.cryptoService
      .getPriceUpdates()
      .subscribe((updates: any) => {
        console.log(updates);
        Object.entries(updates).forEach(([symbol, price]) => {
          const index = this.cryptocurrencies.findIndex(
            (c) => c.symbol.toLowerCase() === symbol
          );
          if (index !== -1) {
            this.cryptocurrencies[index].priceUsd = price as string;
          }
        });
      });
  }

  unsubscribeFromPriceUpdates() {
    if (this.priceUpdatesSubscription) {
      this.priceUpdatesSubscription.unsubscribe();
    }
  }

  sortData() {
    this.cryptocurrencies.sort((a, b) => {
      const aValue = a[this.sortColumn as keyof Cryptocurrency];
      const bValue = b[this.sortColumn as keyof Cryptocurrency];
      return this.sortDirection === 'asc'
        ? (aValue as any).localeCompare(bValue)
        : (bValue as any).localeCompare(aValue);
    });
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.connectToWebSocket();
  }

  get paginatedCryptocurrencies() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.cryptocurrencies.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  toggleFavorite(crypto: Cryptocurrency) {
    crypto.isFavorite = !crypto.isFavorite;
    this.saveFavorites();
  }

  isFavorite(id: string): boolean {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(id);
  }

  saveFavorites() {
    const favorites = this.cryptocurrencies
      .filter((c) => c.isFavorite)
      .map((c) => c.id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  goToDetails(id: string) {
    this.router.navigate(['/details', id]);
  }
}
