import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CryptoDetailsComponent } from '../crypto-details/crypto-details.component';
import { CryptoTableComponent } from '../crypto-table/crypto-table.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-cryptoxchange',
  templateUrl: './cryptoxchange.component.html',
  styleUrls: ['./cryptoxchange.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CryptoTableComponent,
    CryptoDetailsComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class CryptoxchangeComponent {}
