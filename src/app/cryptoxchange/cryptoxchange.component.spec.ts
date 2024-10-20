import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CryptoxchangeComponent } from './cryptoxchange.component';
import { CryptoTableComponent } from './crypto-table/crypto-table.component';
import { CryptoDetailsComponent } from './crypto-details/crypto-details.component';

describe('CryptoxchangeComponent', () => {
  let component: CryptoxchangeComponent;
  let fixture: ComponentFixture<CryptoxchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CryptoxchangeComponent,
        CryptoTableComponent,
        CryptoDetailsComponent,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: CryptoxchangeComponent,
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./crypto-table/crypto-table.component').then(
                    (m) => m.CryptoTableComponent
                  ),
                pathMatch: 'full',
              },
              {
                path: 'details/:id',
                loadComponent: () =>
                  import('./crypto-details/crypto-details.component').then(
                    (m) => m.CryptoDetailsComponent
                  ),
              },
            ],
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CryptoxchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const routerOutletElement =
      fixture.debugElement.nativeElement.querySelector('router-outlet');
    expect(routerOutletElement).toBeTruthy();
  });

  it('should show header and footer components', () => {
    const headerElement =
      fixture.debugElement.nativeElement.querySelector('app-header');
    const footerElement =
      fixture.debugElement.nativeElement.querySelector('app-footer');
    expect(headerElement).toBeTruthy();
    expect(footerElement).toBeTruthy();
  });
});
