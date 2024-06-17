import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizzazioneTirocinioPage } from './visualizzazione-tirocinio.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizzazioneTirocinioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizzazioneTirocinioPageRoutingModule {}
