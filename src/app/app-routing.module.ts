import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
