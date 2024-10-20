import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CryptoDetailsComponent } from './crypto-details.component';
import { CryptoService } from '../../services/crypto.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';

jest.mock('chart.js/auto', () => {
  const mockChart = {
    register: jest.fn(),
    registerables: [], // Add an empty array for registerables
    Chart: jest.fn().mockImplementation(() => ({
      destroy: jest.fn(),
      update: jest.fn(),
    })),
  };
  return mockChart;
});

// Mocking chartjs-adapter-date-fns
jest.mock('chartjs-adapter-date-fns', () => ({}));

describe('CryptoDetailsComponent', () => {
  let component: CryptoDetailsComponent;
  let fixture: ComponentFixture<CryptoDetailsComponent>;
  let cryptoServiceMock: any;
  let localStorageServiceMock: any;
  let routeMock: any;

  beforeEach(async () => {
    cryptoServiceMock = {
      getCryptoDetails: jest.fn(),
      getCryptoHistory: jest.fn(),
    };

    localStorageServiceMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    routeMock = {
      params: of({ id: '1' }),
    };

    await TestBed.configureTestingModule({
      imports: [CryptoDetailsComponent], // Import CryptoDetailsComponent
      providers: [
        { provide: CryptoService, useValue: cryptoServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CryptoDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should load crypto details on init', () => {
    cryptoServiceMock.getCryptoDetails.mockReturnValue(
      of({ data: { id: '1', name: 'Bitcoin' } })
    );
    cryptoServiceMock.getCryptoHistory.mockReturnValue(
      of({ data: [{ time: Date.now(), priceUsd: '50000' }] })
    );

    component.ngOnInit();

    expect(cryptoServiceMock.getCryptoDetails).toHaveBeenCalledWith('1');
    expect(component.cryptoDetails).toEqual({ id: '1', name: 'Bitcoin' });
  });

  it('should update favorites when toggleFavorite is called', () => {
    localStorageServiceMock.getItem.mockReturnValue('["1"]');
    component.cryptoDetails = {
      id: '1',
      symbol: 'BTC',
      name: 'bitcoin',
      priceUsd: '234',
      marketCapUsd: '123456789',
    };
    component.checkIfFavorite('1');

    expect(component.isFavorite).toBe(true);

    component.toggleFavorite();

    expect(localStorageServiceMock.setItem).toHaveBeenCalledWith(
      'favorites',
      '[]'
    );
    expect(component.isFavorite).toBe(false);
  });

  it('should create a chart when price data and view are ready', () => {
    component.priceChartCanvas = {
      nativeElement: document.createElement('canvas'),
    } as ElementRef;

    const priceData = [{ x: new Date(), y: 50000 }];
    component['createChart'](priceData);

    expect(component.chart).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
