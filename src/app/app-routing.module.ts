import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { CryptoDetailsComponent } from './crypto-details/crypto-details.component';
import { CryptoTableComponent } from './crypto-table/crypto-table.component';

const routes: Routes = [
  { path: '', component: CryptoTableComponent },
  { path: 'details/:id', component: CryptoDetailsComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
