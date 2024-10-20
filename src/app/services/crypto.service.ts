import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Crypto } from '../models/crypto.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private wsSubject: WebSocketSubject<any> | null = null;
  private priceUpdates = new BehaviorSubject<any>({});

  // Permanent cache variables
  private cryptoDataCache: Crypto[] | null = null;

  constructor(private http: HttpClient) {
    this.wsSubject = webSocket(environment.wsUrl);
  }

  getCryptocurrencies(): Observable<any> {
    return this.http.get(`${environment.apiUrl}?limit=100`);
  }

  // Fetch top 100 cryptocurrencies from API with permanent caching
  getCryptoData(): Observable<Crypto[]> {
    // If data is already cached, return it
    if (this.cryptoDataCache) {
      return of(this.cryptoDataCache);
    } else {
      // Otherwise, fetch data from the API and cache it permanently
      return this.http.get<any>(`${environment.apiUrl}?limit=100`).pipe(
        map((res) => {
          const cryptoData = res.data;
          // Cache the data permanently
          this.cryptoDataCache = cryptoData;
          return cryptoData;
        }),
        catchError((error) => {
          console.error('Error fetching cryptocurrency data:', error);
          throw error; // Rethrow the error to handle it upstream
        })
      );
    }
  }

  getCryptoDetails(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${id}`);
  }

  getCryptoHistory(id: string): Observable<any> {
    const end = Date.now();
    const start = end - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    return this.http.get(
      `${environment.apiUrl}/${id}/history?interval=d1&start=${start}&end=${end}`
    );
  }

  getPriceUpdates(): Observable<any> {
    return this.priceUpdates.asObservable();
  }

  connectToWebSocket(symbols: string[]) {
    this.disconnectWebSocket();
    const assetsQuery = symbols.join(',');
    this.wsSubject = webSocket(`${environment.wsUrl}${assetsQuery}`);

    this.wsSubject.subscribe(
      (message) => this.priceUpdates.next(message),
      (error) => console.error('WebSocket error:', error),
      () => console.log('WebSocket connection closed')
    );
  }

  disconnectWebSocket() {
    if (this.wsSubject) {
      this.wsSubject.complete();
      this.wsSubject = null;
    }
  }
}
