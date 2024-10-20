import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CryptoxchangeComponent } from './cryptoxchange.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
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
})
export class CryptoxchangeModule {}
