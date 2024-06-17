import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizzazioneTesiPage } from './visualizzazione-tesi.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizzazioneTesiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizzazioneTesiPageRoutingModule {}
