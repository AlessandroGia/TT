import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuovaTesiPage } from './nuova-tesi.page';

const routes: Routes = [
  {
    path: '',
    component: NuovaTesiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuovaTesiPageRoutingModule {}
