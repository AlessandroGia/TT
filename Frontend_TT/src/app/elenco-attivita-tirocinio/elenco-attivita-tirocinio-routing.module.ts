import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElencoAttivitaTirocinioPage } from './elenco-attivita-tirocinio.page';

const routes: Routes = [
  {
    path: '',
    component: ElencoAttivitaTirocinioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElencoAttivitaTirocinioPageRoutingModule {}
