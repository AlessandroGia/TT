import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuovoTirocinioPage } from './nuovo-tirocinio.page';

const routes: Routes = [
  {
    path: '',
    component: NuovoTirocinioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuovoTirocinioPageRoutingModule {}
