import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CryptoTableComponent } from './crypto-table.component';
import { CryptoService } from '../../services/crypto.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';

describe('CryptoTableComponent', () => {
  let component: CryptoTableComponent;
  let fixture: ComponentFixture<CryptoTableComponent>;
  let cryptoServiceMock: jest.Mocked<CryptoService>;
  let localStorageServiceMock: jest.Mocked<LocalStorageService>;

  const mockCryptocurrencies = [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      priceUsd: '30000',
      marketCapUsd: '500000000000',
      isFavorite: false,
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      priceUsd: '2000',
      marketCapUsd: '200000000000',
      isFavorite: true,
    },
  ];

  beforeEach(async () => {
    cryptoServiceMock = {
      getCryptocurrencies: jest
        .fn()
        .mockReturnValue(of({ data: mockCryptocurrencies })),
      connectToWebSocket: jest.fn(),
      disconnectWebSocket: jest.fn(),
      getPriceUpdates: jest.fn().mockReturnValue(of({})),
    } as any;

    localStorageServiceMock = {
      getItem: jest.fn().mockReturnValue(JSON.stringify(['ethereum'])),
      setItem: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      providers: [
        { provide: CryptoService, useValue: cryptoServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CryptoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cryptocurrencies on init', () => {
    expect(cryptoServiceMock.getCryptocurrencies).toHaveBeenCalled();
    expect(component.cryptocurrencies).toEqual(mockCryptocurrencies);
  });

  it('should mark favorites correctly', () => {
    expect(component.cryptocurrencies[0].isFavorite).toBeFalsy();
    expect(component.cryptocurrencies[1].isFavorite).toBeTruthy();
  });

  it('should connect to WebSocket with visible cryptos', () => {
    expect(cryptoServiceMock.connectToWebSocket).toHaveBeenCalledWith([
      'btc',
      'eth',
    ]);
  });

  it('should sort data when sort method is called', () => {
    component.sortColumn = 'name';
    component.sortDirection = 'asc';
    component.sortData();
    expect(component.cryptocurrencies[0].name).toBe('Bitcoin');
    expect(component.cryptocurrencies[1].name).toBe('Ethereum');

    component.sortDirection = 'desc';
    component.sortData();
    expect(component.cryptocurrencies[0].name).toBe('Ethereum');
    expect(component.cryptocurrencies[1].name).toBe('Bitcoin');
  });

  it('should change sort direction when same column is clicked', () => {
    component.sortColumn = 'symbol';
    component.sortDirection = 'asc';
    component.onSort('symbol');
    expect(component.sortDirection).toBe('desc');
  });

  it('should change sort column when different column is clicked', () => {
    component.sortColumn = 'symbol';
    component.sortDirection = 'asc';
    component.onSort('name');
    expect(component.sortColumn).toBe('name');
    expect(component.sortDirection).toBe('asc');
  });

  it('should paginate cryptocurrencies correctly', () => {
    component.itemsPerPage = 1;
    component.currentPage = 1;
    expect(component.paginatedCryptocurrencies.length).toBe(1);
    expect(component.paginatedCryptocurrencies[0].symbol).toBe('BTC');

    component.currentPage = 2;
    expect(component.paginatedCryptocurrencies[0].symbol).toBe('ETH');
  });

  it('should toggle favorite status', () => {
    const crypto = component.cryptocurrencies[0];
    component.toggleFavorite(crypto);
    expect(crypto.isFavorite).toBeTruthy();
    expect(localStorageServiceMock.setItem).toHaveBeenCalled();
  });

  it('should handle price updates', () => {
    const updates = { btc: '31000' };
    jest
      .spyOn(component['cryptoService'], 'getPriceUpdates')
      .mockReturnValue(of(updates));
    component.subscribeToPriceUpdates();
    expect(component.cryptocurrencies[0].priceUsd).toBe('31000');
    expect(component.globalPriceUpdateMessage).toContain(
      'Bitcoin (BTC): Price increased'
    );
  });

  it('should unsubscribe and disconnect WebSocket on destroy', () => {
    const unsubscribeSpy = jest.spyOn(
      component['priceUpdatesSubscription'],
      'unsubscribe'
    );
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(cryptoServiceMock.disconnectWebSocket).toHaveBeenCalled();
  });
});
