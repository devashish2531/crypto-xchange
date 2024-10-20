import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CryptoxchangeComponent } from './cryptoxchange.component';
import { CryptoTableComponent } from './crypto-table/crypto-table.component';
import { CryptoDetailsComponent } from './crypto-details/crypto-details.component';

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
            component: CryptoTableComponent,
            pathMatch: 'full',
          },
          {
            path: 'details/:id',
            component: CryptoDetailsComponent,
          },
        ],
      },
    ]),
  ],
})
export class CryptoxchangeModule {}
