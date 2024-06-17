import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeStudenteTesiPage } from './home-studente-tesi.page';

const routes: Routes = [
  {
    path: '',
    component: HomeStudenteTesiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeStudenteTesiPageRoutingModule {}
