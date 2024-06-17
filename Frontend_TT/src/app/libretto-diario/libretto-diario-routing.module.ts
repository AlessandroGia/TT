import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibrettoDiarioPage } from './libretto-diario.page';

const routes: Routes = [
  {
    path: '',
    component: LibrettoDiarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibrettoDiarioPageRoutingModule {}
