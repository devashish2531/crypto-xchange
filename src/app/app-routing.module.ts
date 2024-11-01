import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'cryptoxchange', pathMatch: 'full' },
  {
    path: 'cryptoxchange',
    loadChildren: () =>
      import('./cryptoxchange/cryptoxchange.module').then(
        (m) => m.CryptoxchangeModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
